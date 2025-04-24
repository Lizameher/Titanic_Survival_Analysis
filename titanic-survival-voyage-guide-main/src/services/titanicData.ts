
import { useState, useEffect } from 'react';

// Define Passenger interface
export interface Passenger {
  PassengerId: number;
  Survived: number;
  Pclass: number;
  Name: string;
  Sex: string;
  Age: number | null;
  SibSp: number;
  Parch: number;
  Ticket: string;
  Fare: number;
  Cabin: string | null;
  Embarked: string | null;
}

// Processed passenger with engineered features
export interface ProcessedPassenger extends Passenger {
  Title?: string;
  FamilySize?: number;
  IsAlone?: boolean;
  AgeBin?: string;
  FareBin?: string;
  HasCabin?: boolean;
}

// Model feature interface
export interface ModelFeatures {
  Pclass: number;
  Sex: number;
  Age: number;
  Fare: number;
  Embarked_C: number;
  Embarked_Q: number;
  Embarked_S: number;
  Title_Master: number;
  Title_Miss: number;
  Title_Mr: number;
  Title_Mrs: number;
  Title_Rare: number;
  FamilySize: number;
  IsAlone: number;
  HasCabin: number;
}

// Hardcoded Titanic dataset (simplified for demo purposes)
const titanicDataset: Passenger[] = [
  {
    PassengerId: 1,
    Survived: 0,
    Pclass: 3,
    Name: "Braund, Mr. Owen Harris",
    Sex: "male",
    Age: 22,
    SibSp: 1,
    Parch: 0,
    Ticket: "A/5 21171",
    Fare: 7.25,
    Cabin: null,
    Embarked: "S"
  },
  {
    PassengerId: 2,
    Survived: 1,
    Pclass: 1,
    Name: "Cumings, Mrs. John Bradley (Florence Briggs Thayer)",
    Sex: "female",
    Age: 38,
    SibSp: 1,
    Parch: 0,
    Ticket: "PC 17599",
    Fare: 71.2833,
    Cabin: "C85",
    Embarked: "C"
  },
  {
    PassengerId: 3,
    Survived: 1,
    Pclass: 3,
    Name: "Heikkinen, Miss. Laina",
    Sex: "female",
    Age: 26,
    SibSp: 0,
    Parch: 0,
    Ticket: "STON/O2. 3101282",
    Fare: 7.925,
    Cabin: null,
    Embarked: "S"
  },
  {
    PassengerId: 4,
    Survived: 1,
    Pclass: 1,
    Name: "Futrelle, Mrs. Jacques Heath (Lily May Peel)",
    Sex: "female",
    Age: 35,
    SibSp: 1,
    Parch: 0,
    Ticket: "113803",
    Fare: 53.1,
    Cabin: "C123",
    Embarked: "S"
  },
  {
    PassengerId: 5,
    Survived: 0,
    Pclass: 3,
    Name: "Allen, Mr. William Henry",
    Sex: "male",
    Age: 35,
    SibSp: 0,
    Parch: 0,
    Ticket: "373450",
    Fare: 8.05,
    Cabin: null,
    Embarked: "S"
  },
  {
    PassengerId: 6,
    Survived: 0,
    Pclass: 3,
    Name: "Moran, Mr. James",
    Sex: "male",
    Age: null,
    SibSp: 0,
    Parch: 0,
    Ticket: "330877",
    Fare: 8.4583,
    Cabin: null,
    Embarked: "Q"
  },
  {
    PassengerId: 7,
    Survived: 0,
    Pclass: 1,
    Name: "McCarthy, Mr. Timothy J",
    Sex: "male",
    Age: 54,
    SibSp: 0,
    Parch: 0,
    Ticket: "17463",
    Fare: 51.8625,
    Cabin: "E46",
    Embarked: "S"
  },
  {
    PassengerId: 8,
    Survived: 0,
    Pclass: 3,
    Name: "Palsson, Master. Gosta Leonard",
    Sex: "male",
    Age: 2,
    SibSp: 3,
    Parch: 1,
    Ticket: "349909",
    Fare: 21.075,
    Cabin: null,
    Embarked: "S"
  },
  {
    PassengerId: 9,
    Survived: 1,
    Pclass: 3,
    Name: "Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg)",
    Sex: "female",
    Age: 27,
    SibSp: 0,
    Parch: 2,
    Ticket: "347742",
    Fare: 11.1333,
    Cabin: null,
    Embarked: "S"
  },
  {
    PassengerId: 10,
    Survived: 1,
    Pclass: 2,
    Name: "Nasser, Mrs. Nicholas (Adele Achem)",
    Sex: "female",
    Age: 14,
    SibSp: 1,
    Parch: 0,
    Ticket: "237736",
    Fare: 30.0708,
    Cabin: null,
    Embarked: "C"
  }
];

// For a larger dataset (100 entries)
const generateMorePassengers = (): Passenger[] => {
  const basePassengers = [...titanicDataset];
  const titles = ["Mr.", "Mrs.", "Miss.", "Master.", "Dr.", "Rev.", "Major.", "Col.", "Capt."];
  const cabins = [null, "A12", "B45", "C85", "D23", "E46", null, null, null, null];
  const embarked = ["C", "S", "Q", null];
  
  for (let id = basePassengers.length + 1; id <= 100; id++) {
    const randomSurvived = Math.random() > 0.6 ? 0 : 1;
    const randomClass = Math.floor(Math.random() * 3) + 1;
    const randomSex = Math.random() > 0.6 ? "male" : "female";
    const randomAge = Math.random() > 0.1 ? Math.floor(Math.random() * 80) : null;
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomLastName = `LastName${id}`;
    const randomSibSp = Math.floor(Math.random() * 5);
    const randomParch = Math.floor(Math.random() * 5);
    const randomFare = Math.random() * 100;
    const randomCabin = cabins[Math.floor(Math.random() * cabins.length)];
    const randomEmbarked = embarked[Math.floor(Math.random() * embarked.length)];
    
    basePassengers.push({
      PassengerId: id,
      Survived: randomSurvived,
      Pclass: randomClass,
      Name: `${randomLastName}, ${randomTitle} FirstName${id}`,
      Sex: randomSex,
      Age: randomAge,
      SibSp: randomSibSp,
      Parch: randomParch,
      Ticket: `TICKET${id}`,
      Fare: randomFare,
      Cabin: randomCabin,
      Embarked: randomEmbarked
    });
  }
  
  return basePassengers;
};

const fullDataset = generateMorePassengers();

export const useTitanicData = () => {
  const [data, setData] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simulate API loading
      setTimeout(() => {
        setData(fullDataset);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to load Titanic dataset");
      setLoading(false);
    }
  }, []);

  // Basic statistics
  const getBasicStats = () => {
    if (data.length === 0) return null;
    
    // Survival rate
    const survivedCount = data.filter(p => p.Survived === 1).length;
    const survivalRate = (survivedCount / data.length) * 100;
    
    // Age statistics
    const validAges = data.filter(p => p.Age !== null).map(p => p.Age as number);
    const avgAge = validAges.reduce((sum, age) => sum + age, 0) / validAges.length;
    const minAge = Math.min(...validAges);
    const maxAge = Math.max(...validAges);
    
    // Class distribution
    const classCounts = {
      first: data.filter(p => p.Pclass === 1).length,
      second: data.filter(p => p.Pclass === 2).length,
      third: data.filter(p => p.Pclass === 3).length
    };
    
    // Gender distribution
    const genderCounts = {
      male: data.filter(p => p.Sex === "male").length,
      female: data.filter(p => p.Sex === "female").length
    };
    
    // Embarked distribution
    const embarkedCounts = {
      C: data.filter(p => p.Embarked === "C").length,
      S: data.filter(p => p.Embarked === "S").length,
      Q: data.filter(p => p.Embarked === "Q").length,
      null: data.filter(p => p.Embarked === null).length
    };
    
    return {
      totalPassengers: data.length,
      survivedCount,
      survivalRate,
      ageStats: {
        average: avgAge,
        min: minAge,
        max: maxAge,
        missing: data.length - validAges.length
      },
      classCounts,
      genderCounts,
      embarkedCounts
    };
  };
  
  // Missing values analysis
  const getMissingValues = () => {
    if (data.length === 0) return null;
    
    return {
      Age: data.filter(p => p.Age === null).length,
      Cabin: data.filter(p => p.Cabin === null).length,
      Embarked: data.filter(p => p.Embarked === null).length
    };
  };
  
  // Survival rate by different categories
  const getSurvivalByCategory = () => {
    if (data.length === 0) return null;
    
    // By class
    const byClass = {
      first: {
        total: data.filter(p => p.Pclass === 1).length,
        survived: data.filter(p => p.Pclass === 1 && p.Survived === 1).length
      },
      second: {
        total: data.filter(p => p.Pclass === 2).length,
        survived: data.filter(p => p.Pclass === 2 && p.Survived === 1).length
      },
      third: {
        total: data.filter(p => p.Pclass === 3).length,
        survived: data.filter(p => p.Pclass === 3 && p.Survived === 1).length
      }
    };
    
    // By gender
    const byGender = {
      male: {
        total: data.filter(p => p.Sex === "male").length,
        survived: data.filter(p => p.Sex === "male" && p.Survived === 1).length
      },
      female: {
        total: data.filter(p => p.Sex === "female").length,
        survived: data.filter(p => p.Sex === "female" && p.Survived === 1).length
      }
    };
    
    // By embarked
    const byEmbarked = {
      C: {
        total: data.filter(p => p.Embarked === "C").length,
        survived: data.filter(p => p.Embarked === "C" && p.Survived === 1).length
      },
      S: {
        total: data.filter(p => p.Embarked === "S").length,
        survived: data.filter(p => p.Embarked === "S" && p.Survived === 1).length
      },
      Q: {
        total: data.filter(p => p.Embarked === "Q").length,
        survived: data.filter(p => p.Embarked === "Q" && p.Survived === 1).length
      }
    };
    
    return {
      byClass,
      byGender,
      byEmbarked
    };
  };

  // Feature engineering functions
  const processData = (): ProcessedPassenger[] => {
    if (data.length === 0) return [];
    
    return data.map(passenger => {
      // Extract title from name
      const nameMatch = passenger.Name.match(/,\s(.*?)\./);
      const title = nameMatch ? nameMatch[1] : "Unknown";
      
      // Create family size
      const familySize = passenger.SibSp + passenger.Parch + 1;
      
      // Is alone flag
      const isAlone = familySize === 1;
      
      // Has cabin flag
      const hasCabin = passenger.Cabin !== null;
      
      // Age binning
      let ageBin = "Unknown";
      if (passenger.Age !== null) {
        if (passenger.Age < 12) ageBin = "Child";
        else if (passenger.Age < 18) ageBin = "Teenager";
        else if (passenger.Age < 35) ageBin = "Young Adult";
        else if (passenger.Age < 60) ageBin = "Adult";
        else ageBin = "Elderly";
      }
      
      // Fare binning
      let fareBin = "Unknown";
      if (passenger.Fare < 10) fareBin = "Low";
      else if (passenger.Fare < 30) fareBin = "Medium";
      else if (passenger.Fare < 100) fareBin = "High";
      else fareBin = "Very High";
      
      return {
        ...passenger,
        Title: title,
        FamilySize: familySize,
        IsAlone: isAlone,
        HasCabin: hasCabin,
        AgeBin: ageBin,
        FareBin: fareBin
      };
    });
  };

  // Convert to model features with one-hot encoding
  const convertToModelFeatures = (passenger: ProcessedPassenger): ModelFeatures => {
    // Default values for missing data
    const defaultAge = 29.7; // assumed median age
    const defaultFare = 14.45; // assumed median fare
    const defaultEmbarked = "S"; // most common embarkation port
    
    // Process title to common categories
    let processedTitle = "Mr";
    if (passenger.Title) {
      if (["Mr.", "Don.", "Rev.", "Major.", "Col.", "Capt."].includes(passenger.Title))
        processedTitle = "Mr";
      else if (["Mrs.", "Mme.", "Countess."].includes(passenger.Title))
        processedTitle = "Mrs";
      else if (["Miss.", "Mlle.", "Ms."].includes(passenger.Title))
        processedTitle = "Miss";
      else if (["Master."].includes(passenger.Title))
        processedTitle = "Master";
      else
        processedTitle = "Rare";
    }
    
    return {
      Pclass: passenger.Pclass,
      Sex: passenger.Sex === "male" ? 0 : 1,
      Age: passenger.Age !== null ? passenger.Age : defaultAge,
      Fare: passenger.Fare,
      Embarked_C: (passenger.Embarked || defaultEmbarked) === "C" ? 1 : 0,
      Embarked_Q: (passenger.Embarked || defaultEmbarked) === "Q" ? 1 : 0,
      Embarked_S: (passenger.Embarked || defaultEmbarked) === "S" ? 1 : 0,
      Title_Master: processedTitle === "Master" ? 1 : 0,
      Title_Miss: processedTitle === "Miss" ? 1 : 0,
      Title_Mr: processedTitle === "Mr" ? 1 : 0,
      Title_Mrs: processedTitle === "Mrs" ? 1 : 0,
      Title_Rare: processedTitle === "Rare" ? 1 : 0,
      FamilySize: passenger.FamilySize || 1,
      IsAlone: passenger.IsAlone ? 1 : 0,
      HasCabin: passenger.HasCabin ? 1 : 0
    };
  };

  // Model prediction functions (simulated)
  const predictLinearRegression = (features: ModelFeatures): number => {
    // Simplified linear regression model coefficients
    const coefficients = {
      Intercept: 0.042,
      Pclass: -0.15,
      Sex: 0.53,
      Age: -0.007,
      Fare: 0.0023,
      Embarked_C: 0.13,
      Embarked_Q: 0.05,
      Embarked_S: -0.15,
      Title_Master: 0.36,
      Title_Miss: 0.32,
      Title_Mr: -0.28,
      Title_Mrs: 0.31,
      Title_Rare: 0.12,
      FamilySize: -0.02,
      IsAlone: -0.08,
      HasCabin: 0.14
    };
    
    // Calculate linear prediction
    let prediction = coefficients.Intercept;
    prediction += coefficients.Pclass * features.Pclass;
    prediction += coefficients.Sex * features.Sex;
    prediction += coefficients.Age * features.Age;
    prediction += coefficients.Fare * features.Fare;
    prediction += coefficients.Embarked_C * features.Embarked_C;
    prediction += coefficients.Embarked_Q * features.Embarked_Q;
    prediction += coefficients.Embarked_S * features.Embarked_S;
    prediction += coefficients.Title_Master * features.Title_Master;
    prediction += coefficients.Title_Miss * features.Title_Miss;
    prediction += coefficients.Title_Mr * features.Title_Mr;
    prediction += coefficients.Title_Mrs * features.Title_Mrs;
    prediction += coefficients.Title_Rare * features.Title_Rare;
    prediction += coefficients.FamilySize * features.FamilySize;
    prediction += coefficients.IsAlone * features.IsAlone;
    prediction += coefficients.HasCabin * features.HasCabin;
    
    // Convert to binary prediction
    return prediction > 0.5 ? 1 : 0;
  };

  const predictDecisionTree = (features: ModelFeatures): number => {
    // Simplified decision tree rules
    if (features.Sex === 1) {  // Female
      if (features.Pclass === 1 || features.Pclass === 2) {
        return 1;  // High class females mostly survived
      } else {  // Pclass 3
        if (features.Age < 30) return 1;
        else return 0;
      }
    } else {  // Male
      if (features.Age < 10) {
        return 1;  // Young boys mostly survived
      } else if (features.Pclass === 1 && features.Fare > 50) {
        return 1;  // Wealthy men had higher chances
      } else {
        return 0;  // Most men didn't survive
      }
    }
  };

  // Model evaluation metrics
  const getModelMetrics = () => {
    const processedData = processData();
    const predictions = {
      linearRegression: [] as number[],
      decisionTree: [] as number[],
      actual: [] as number[]
    };
    
    // Make predictions on all data
    processedData.forEach(passenger => {
      const features = convertToModelFeatures(passenger);
      predictions.linearRegression.push(predictLinearRegression(features));
      predictions.decisionTree.push(predictDecisionTree(features));
      predictions.actual.push(passenger.Survived);
    });
    
    // Calculate accuracy
    const calculateAccuracy = (predicted: number[], actual: number[]): number => {
      let correct = 0;
      for (let i = 0; i < predicted.length; i++) {
        if (predicted[i] === actual[i]) correct++;
      }
      return correct / predicted.length;
    };
    
    // Calculate precision
    const calculatePrecision = (predicted: number[], actual: number[]): number => {
      let truePositives = 0;
      let falsePositives = 0;
      for (let i = 0; i < predicted.length; i++) {
        if (predicted[i] === 1 && actual[i] === 1) truePositives++;
        if (predicted[i] === 1 && actual[i] === 0) falsePositives++;
      }
      return truePositives / (truePositives + falsePositives);
    };
    
    // Calculate recall
    const calculateRecall = (predicted: number[], actual: number[]): number => {
      let truePositives = 0;
      let falseNegatives = 0;
      for (let i = 0; i < predicted.length; i++) {
        if (predicted[i] === 1 && actual[i] === 1) truePositives++;
        if (predicted[i] === 0 && actual[i] === 1) falseNegatives++;
      }
      return truePositives / (truePositives + falseNegatives);
    };
    
    // Calculate F1 score
    const calculateF1 = (precision: number, recall: number): number => {
      return 2 * precision * recall / (precision + recall);
    };
    
    const lrAccuracy = calculateAccuracy(predictions.linearRegression, predictions.actual);
    const lrPrecision = calculatePrecision(predictions.linearRegression, predictions.actual);
    const lrRecall = calculateRecall(predictions.linearRegression, predictions.actual);
    const lrF1 = calculateF1(lrPrecision, lrRecall);
    
    const dtAccuracy = calculateAccuracy(predictions.decisionTree, predictions.actual);
    const dtPrecision = calculatePrecision(predictions.decisionTree, predictions.actual);
    const dtRecall = calculateRecall(predictions.decisionTree, predictions.actual);
    const dtF1 = calculateF1(dtPrecision, dtRecall);
    
    return {
      linearRegression: {
        accuracy: lrAccuracy,
        precision: lrPrecision,
        recall: lrRecall,
        f1: lrF1
      },
      decisionTree: {
        accuracy: dtAccuracy,
        precision: dtPrecision,
        recall: dtRecall,
        f1: dtF1
      }
    };
  };

  return {
    data,
    loading,
    error,
    getBasicStats,
    getMissingValues,
    getSurvivalByCategory,
    processData,
    convertToModelFeatures,
    predictLinearRegression,
    predictDecisionTree,
    getModelMetrics
  };
};
