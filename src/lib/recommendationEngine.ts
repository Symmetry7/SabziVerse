import { Crop, CropType, QualityGrade } from "@/types";

export interface BuyerPreferences {
  preferredCrops: CropType[];
  maxBudgetPerQuintal: number;
  minQuality: QualityGrade;
  preferOrganic: boolean;
  maxDistance: number; // in km
  minQuantity: number;
  urgency: "low" | "medium" | "high";
  sampleRequired: boolean;
}

export interface OptimalMatch {
  crop: Crop;
  score: number;
  reasons: string[];
  priceAdvantage: number; // percentage below market average
  qualityScore: number;
  availabilityScore: number;
  distanceScore: number;
  valueScore: number;
}

export interface MarketInsights {
  averagePrice: number;
  priceRange: { min: number; max: number };
  totalAvailable: number;
  organicPercentage: number;
  qualityDistribution: Record<QualityGrade, number>;
  topRegions: Array<{ region: string; count: number; avgPrice: number }>;
  priceHistory: Array<{ date: string; price: number }>;
  recommendations: string[];
}

export class SmartRecommendationEngine {
  private static calculateQualityScore(quality: QualityGrade): number {
    const scores = { premium: 100, good: 80, standard: 60 };
    return scores[quality] || 60;
  }

  private static calculateDistanceScore(
    farmerLocation: string,
    targetDistance: number,
  ): number {
    // Simplified distance calculation - in real app, use geolocation
    const stateDistances: Record<string, number> = {
      haryana: 50,
      maharashtra: 800,
      gujarat: 600,
      punjab: 100,
      rajasthan: 300,
      uttar: 200,
      bihar: 400,
      kerala: 1200,
      karnataka: 900,
      tamil: 1000,
      telangana: 700,
      andhra: 750,
    };

    const estimatedDistance =
      Object.entries(stateDistances).find(([state]) =>
        farmerLocation.toLowerCase().includes(state),
      )?.[1] || 500;

    return Math.max(0, 100 - (estimatedDistance / targetDistance) * 100);
  }

  private static calculateAvailabilityScore(crop: Crop): number {
    const harvestDate = new Date(crop.harvestDate);
    const availableUntil = new Date(crop.availableUntil);
    const now = new Date();

    const totalDuration = availableUntil.getTime() - harvestDate.getTime();
    const timeLeft = availableUntil.getTime() - now.getTime();

    return Math.max(0, (timeLeft / totalDuration) * 100);
  }

  private static calculateValueScore(
    crop: Crop,
    marketAverage: number,
  ): number {
    if (marketAverage === 0) return 50;
    const priceAdvantage =
      ((marketAverage - crop.pricePerUnit) / marketAverage) * 100;
    return Math.max(0, Math.min(100, 50 + priceAdvantage));
  }

  static findOptimalProducts(
    allCrops: Crop[],
    preferences: BuyerPreferences,
  ): OptimalMatch[] {
    // Filter crops based on basic preferences
    const filteredCrops = allCrops.filter((crop) => {
      if (
        preferences.preferredCrops.length > 0 &&
        !preferences.preferredCrops.includes(crop.cropType)
      )
        return false;
      if (crop.pricePerUnit > preferences.maxBudgetPerQuintal) return false;
      if (crop.quantity < preferences.minQuantity) return false;
      if (preferences.preferOrganic && !crop.isOrganic) return false;
      if (preferences.sampleRequired && !crop.sampleDelivery?.available)
        return false;

      const qualityRanking = { premium: 3, good: 2, standard: 1 };
      const minQualityRank = qualityRanking[preferences.minQuality];
      const cropQualityRank = qualityRanking[crop.quality];
      if (cropQualityRank < minQualityRank) return false;

      return true;
    });

    // Calculate market average for value scoring
    const marketAverage =
      filteredCrops.reduce((sum, c) => sum + c.pricePerUnit, 0) /
      (filteredCrops.length || 1);

    // Score each crop
    const scoredCrops: OptimalMatch[] = filteredCrops.map((crop) => {
      const qualityScore = this.calculateQualityScore(crop.quality);
      const distanceScore = this.calculateDistanceScore(
        crop.farmerVillage,
        preferences.maxDistance,
      );
      const availabilityScore = this.calculateAvailabilityScore(crop);
      const valueScore = this.calculateValueScore(crop, marketAverage);
      const priceAdvantage =
        ((marketAverage - crop.pricePerUnit) / marketAverage) * 100;

      // Weighted scoring based on urgency
      const weights =
        preferences.urgency === "high"
          ? { quality: 0.2, distance: 0.3, availability: 0.3, value: 0.2 }
          : preferences.urgency === "medium"
            ? { quality: 0.25, distance: 0.25, availability: 0.25, value: 0.25 }
            : { quality: 0.3, distance: 0.2, availability: 0.2, value: 0.3 };

      const totalScore =
        qualityScore * weights.quality +
        distanceScore * weights.distance +
        availabilityScore * weights.availability +
        valueScore * weights.value;

      // Generate reasons for recommendation
      const reasons: string[] = [];
      if (priceAdvantage > 10)
        reasons.push(`${Math.round(priceAdvantage)}% below market price`);
      if (qualityScore >= 90) reasons.push("Premium quality");
      if (crop.isOrganic) reasons.push("Certified organic");
      if (distanceScore > 80) reasons.push("Nearby location");
      if (availabilityScore > 70) reasons.push("Fresh stock available");
      if (crop.sampleDelivery?.available)
        reasons.push("Sample delivery available");

      return {
        crop,
        score: totalScore,
        reasons,
        priceAdvantage: Math.max(0, priceAdvantage),
        qualityScore,
        availabilityScore,
        distanceScore,
        valueScore,
      };
    });

    // Sort by score and return top matches
    return scoredCrops.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  static getMarketInsights(crops: Crop[], cropType?: CropType): MarketInsights {
    const relevantCrops = cropType
      ? crops.filter((c) => c.cropType === cropType)
      : crops;

    if (relevantCrops.length === 0) {
      return {
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        totalAvailable: 0,
        organicPercentage: 0,
        qualityDistribution: { premium: 0, good: 0, standard: 0 },
        topRegions: [],
        priceHistory: [],
        recommendations: ["No data available for analysis"],
      };
    }

    const prices = relevantCrops.map((c) => c.pricePerUnit);
    const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
    const totalAvailable = relevantCrops.reduce(
      (sum, c) => sum + c.quantity,
      0,
    );
    const organicCount = relevantCrops.filter((c) => c.isOrganic).length;
    const organicPercentage = (organicCount / relevantCrops.length) * 100;

    // Quality distribution
    const qualityDistribution = relevantCrops.reduce(
      (acc, crop) => {
        acc[crop.quality] = (acc[crop.quality] || 0) + 1;
        return acc;
      },
      {} as Record<QualityGrade, number>,
    );

    // Top regions
    const regionData = relevantCrops.reduce(
      (acc, crop) => {
        const region = crop.farmerVillage;
        if (!acc[region]) {
          acc[region] = { count: 0, totalPrice: 0 };
        }
        acc[region].count++;
        acc[region].totalPrice += crop.pricePerUnit;
        return acc;
      },
      {} as Record<string, { count: number; totalPrice: number }>,
    );

    const topRegions = Object.entries(regionData)
      .map(([region, data]) => ({
        region,
        count: data.count,
        avgPrice: data.totalPrice / data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Generate recommendations
    const recommendations: string[] = [];
    if (organicPercentage > 30) {
      recommendations.push(
        "High availability of organic produce - consider premium pricing",
      );
    }
    if (priceRange.max - priceRange.min > averagePrice * 0.5) {
      recommendations.push("Wide price variation - negotiate for better deals");
    }
    if (qualityDistribution.premium > qualityDistribution.standard) {
      recommendations.push(
        "Premium quality crops dominate - expect higher prices",
      );
    }

    const lowestPriceRegion = topRegions.reduce(
      (min, region) => (region.avgPrice < min.avgPrice ? region : min),
      topRegions[0],
    );
    if (lowestPriceRegion) {
      recommendations.push(`Best prices found in ${lowestPriceRegion.region}`);
    }

    return {
      averagePrice: Math.round(averagePrice),
      priceRange,
      totalAvailable,
      organicPercentage: Math.round(organicPercentage),
      qualityDistribution,
      topRegions,
      priceHistory: [], // Would be populated from historical data
      recommendations,
    };
  }

  static generateBulkPurchaseStrategy(
    requirements: {
      cropType: CropType;
      totalQuantity: number;
      maxBudget: number;
    },
    availableCrops: Crop[],
  ): {
    strategy: Array<{ crop: Crop; quantity: number; cost: number }>;
    totalCost: number;
    savings: number;
    feasible: boolean;
  } {
    const relevantCrops = availableCrops
      .filter((c) => c.cropType === requirements.cropType)
      .sort((a, b) => a.pricePerUnit - b.pricePerUnit);

    let remainingQuantity = requirements.totalQuantity;
    let totalCost = 0;
    const strategy: Array<{ crop: Crop; quantity: number; cost: number }> = [];

    for (const crop of relevantCrops) {
      if (remainingQuantity <= 0) break;

      const quantityFromThisCrop = Math.min(remainingQuantity, crop.quantity);
      const cost = quantityFromThisCrop * crop.pricePerUnit;

      if (totalCost + cost <= requirements.maxBudget) {
        strategy.push({
          crop,
          quantity: quantityFromThisCrop,
          cost,
        });
        totalCost += cost;
        remainingQuantity -= quantityFromThisCrop;
      }
    }

    const avgMarketPrice =
      relevantCrops.reduce((sum, c) => sum + c.pricePerUnit, 0) /
      (relevantCrops.length || 1);
    const marketCostForQuantity =
      (requirements.totalQuantity - remainingQuantity) * avgMarketPrice;
    const savings = Math.max(0, marketCostForQuantity - totalCost);

    return {
      strategy,
      totalCost,
      savings,
      feasible: remainingQuantity === 0 && totalCost <= requirements.maxBudget,
    };
  }
}
