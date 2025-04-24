
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useTitanicData, ProcessedPassenger } from '@/services/titanicData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Ship, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const Prediction = () => {
  const { loading, convertToModelFeatures, predictLinearRegression, predictDecisionTree } = useTitanicData();
  const { toast } = useToast();
  
  const [passengerData, setPassengerData] = useState<Partial<ProcessedPassenger>>({
    Pclass: 3,
    Sex: 'male',
    Age: 30,
    SibSp: 0,
    Parch: 0,
    Fare: 15,
    Cabin: null,
    Embarked: 'S',
    Title: 'Mr.'
  });
  
  const [predictions, setPredictions] = useState<{ linear: number | null, tree: number | null }>({
    linear: null,
    tree: null
  });
  
  const [showResults, setShowResults] = useState(false);
  
  const handleInputChange = (field: keyof ProcessedPassenger, value: any) => {
    setPassengerData(prev => ({ ...prev, [field]: value }));
    
    // Update Title if Sex changes
    if (field === 'Sex') {
      if (value === 'male') {
        setPassengerData(prev => ({ ...prev, Title: prev.Title === 'Mrs.' || prev.Title === 'Miss.' ? 'Mr.' : prev.Title }));
      } else if (value === 'female') {
        setPassengerData(prev => ({ 
          ...prev, 
          Title: prev.Title === 'Mr.' ? 
            (passengerData.Age && passengerData.Age < 18 ? 'Miss.' : 'Mrs.') : 
            prev.Title 
        }));
      }
    }
    
    // Update Title if Age changes for females
    if (field === 'Age' && passengerData.Sex === 'female') {
      const age = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(age)) {
        setPassengerData(prev => ({
          ...prev,
          Title: age < 18 ? 'Miss.' : (prev.Title === 'Miss.' ? 'Mrs.' : prev.Title)
        }));
      }
    }
    
    // Reset predictions when data changes
    setPredictions({ linear: null, tree: null });
    setShowResults(false);
  };
  
  const handlePredict = () => {
    try {
      // Create a processed passenger
      const passenger: ProcessedPassenger = {
        PassengerId: 0,
        Survived: 0, // This will be predicted
        Pclass: passengerData.Pclass || 3,
        Name: `Hypothetical, ${passengerData.Title} Passenger`,
        Sex: passengerData.Sex || 'male',
        Age: passengerData.Age || 30,
        SibSp: passengerData.SibSp || 0,
        Parch: passengerData.Parch || 0,
        Ticket: "HYPO",
        Fare: passengerData.Fare || 15,
        Cabin: passengerData.Cabin,
        Embarked: passengerData.Embarked || 'S',
        Title: passengerData.Title,
        FamilySize: (passengerData.SibSp || 0) + (passengerData.Parch || 0) + 1,
        IsAlone: (passengerData.SibSp || 0) + (passengerData.Parch || 0) === 0,
        HasCabin: passengerData.Cabin !== null,
      };
      
      // Convert to model features and predict
      const features = convertToModelFeatures(passenger);
      const linearPrediction = predictLinearRegression(features);
      const treePrediction = predictDecisionTree(features);
      
      setPredictions({
        linear: linearPrediction,
        tree: treePrediction
      });
      
      setShowResults(true);
      
      toast({
        title: "Prediction Complete",
        description: "Your passenger survival prediction is ready.",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Error",
        description: "There was a problem generating your prediction.",
        variant: "destructive",
      });
    }
  };
  
  const getSurvivalChance = () => {
    if (predictions.linear === null || predictions.tree === null) return "Unknown";
    
    // Both models predict survival
    if (predictions.linear === 1 && predictions.tree === 1) 
      return "Very High";
    
    // Both models predict death
    if (predictions.linear === 0 && predictions.tree === 0)
      return "Very Low";
    
    // Models disagree
    return "Moderate";
  };
  
  const getSurvivalChanceColor = () => {
    const chance = getSurvivalChance();
    
    switch (chance) {
      case "Very High":
        return "text-green-600";
      case "Very Low":
        return "text-red-600";
      case "Moderate":
        return "text-amber-600";
      default:
        return "text-slate-600";
    }
  };
  
  const modelData = [
    { name: "Linear Regression", prediction: predictions.linear },
    { name: "Decision Tree", prediction: predictions.tree },
  ];
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-ocean-dark">Survival Prediction</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
                <CardDescription>Enter hypothetical passenger details to predict survival</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="pclass">Passenger Class</Label>
                      <Select 
                        value={passengerData.Pclass?.toString()}
                        onValueChange={(value) => handleInputChange('Pclass', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">First Class</SelectItem>
                          <SelectItem value="2">Second Class</SelectItem>
                          <SelectItem value="3">Third Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="sex">Gender</Label>
                      <Select 
                        value={passengerData.Sex}
                        onValueChange={(value) => handleInputChange('Sex', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="age">Age: {passengerData.Age}</Label>
                      <Slider 
                        value={[passengerData.Age || 30]} 
                        min={1}
                        max={80}
                        step={1}
                        onValueChange={(value) => handleInputChange('Age', value[0])}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Select
                        value={passengerData.Title}
                        onValueChange={(value) => handleInputChange('Title', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          {passengerData.Sex === 'male' ? (
                            <>
                              <SelectItem value="Mr.">Mr.</SelectItem>
                              <SelectItem value="Master.">Master (Boy)</SelectItem>
                              <SelectItem value="Dr.">Dr.</SelectItem>
                              <SelectItem value="Rev.">Rev.</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Mrs.">Mrs.</SelectItem>
                              <SelectItem value="Miss.">Miss</SelectItem>
                              <SelectItem value="Mme.">Mme.</SelectItem>
                              <SelectItem value="Dr.">Dr.</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="sibsp">Siblings/Spouses</Label>
                      <Select 
                        value={passengerData.SibSp?.toString()}
                        onValueChange={(value) => handleInputChange('SibSp', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="parch">Parents/Children</Label>
                      <Select 
                        value={passengerData.Parch?.toString()}
                        onValueChange={(value) => handleInputChange('Parch', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="fare">Fare (£): {passengerData.Fare}</Label>
                      <Slider 
                        value={[passengerData.Fare || 15]} 
                        min={5}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleInputChange('Fare', value[0])}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="embarked">Port of Embarkation</Label>
                      <Select 
                        value={passengerData.Embarked}
                        onValueChange={(value) => handleInputChange('Embarked', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select port" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C">Cherbourg (C)</SelectItem>
                          <SelectItem value="Q">Queenstown (Q)</SelectItem>
                          <SelectItem value="S">Southampton (S)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="cabin">Cabin Assignment</Label>
                      <Select 
                        value={passengerData.Cabin !== null ? "yes" : "no"}
                        onValueChange={(value) => handleInputChange('Cabin', value === "yes" ? "C101" : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Has cabin?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Has a cabin</SelectItem>
                          <SelectItem value="no">No cabin assigned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="mt-6 w-full" 
                  size="lg"
                  onClick={handlePredict}
                >
                  <Ship className="mr-2 h-5 w-5" /> Predict Survival
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className={`h-full ${showResults ? 'border-ocean' : ''}`}>
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
                <CardDescription>Model predictions for this passenger</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                {showResults ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-medium mb-1">Survival Chance</h3>
                      <p className={`text-5xl font-bold ${getSurvivalChanceColor()}`}>
                        {getSurvivalChance()}
                      </p>
                    </div>
                    
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={modelData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name }) => name}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="prediction"
                          >
                            {modelData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.prediction === 1 ? '#4ade80' : '#f87171'} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [
                              value === 1 ? "Survived" : "Did Not Survive", 
                              "Prediction"
                            ]} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                      <div className={`p-3 rounded-lg text-center ${
                        predictions.linear === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <p className="text-xs font-medium">Linear Regression</p>
                        <p className="font-bold">{predictions.linear === 1 ? 'SURVIVED' : 'DIED'}</p>
                      </div>
                      
                      <div className={`p-3 rounded-lg text-center ${
                        predictions.tree === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <p className="text-xs font-medium">Decision Tree</p>
                        <p className="font-bold">{predictions.tree === 1 ? 'SURVIVED' : 'DIED'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-muted-foreground">Fill out the passenger details and click "Predict Survival" to see results</p>
                  </div>
                )}
              </CardContent>
              {showResults && (
                <CardFooter className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    These predictions are based on patterns found in the Titanic dataset. 
                    {predictions.linear === predictions.tree 
                      ? " Both models agree on this passenger's fate."
                      : " The models disagree, indicating uncertainty in the prediction."}
                  </p>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Prediction;
