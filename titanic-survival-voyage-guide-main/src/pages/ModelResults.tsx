
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useTitanicData } from '@/services/titanicData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ModelResults = () => {
  const { loading, getModelMetrics } = useTitanicData();
  const [activeTab, setActiveTab] = useState('compare');
  
  const metrics = getModelMetrics();
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
        </div>
      </Layout>
    );
  }
  
  const formatMetricsForBar = () => {
    return [
      { name: 'Accuracy', LinearRegression: metrics?.linearRegression.accuracy, DecisionTree: metrics?.decisionTree.accuracy },
      { name: 'Precision', LinearRegression: metrics?.linearRegression.precision, DecisionTree: metrics?.decisionTree.precision },
      { name: 'Recall', LinearRegression: metrics?.linearRegression.recall, DecisionTree: metrics?.decisionTree.recall },
      { name: 'F1 Score', LinearRegression: metrics?.linearRegression.f1, DecisionTree: metrics?.decisionTree.f1 }
    ];
  };
  
  const treeData = [
    { name: 'Sex?', value: 100, color: '#0c4a6e' },
    { name: 'Female', value: 40, color: '#bae6fd' },
    { name: 'Male', value: 60, color: '#0ea5e9' },
    { name: 'Class?', value: 40, parent: 'Female', color: '#7dd3fc' },
    { name: 'Age?', value: 60, parent: 'Male', color: '#38bdf8' },
    { name: '1st/2nd', value: 30, parent: 'Class?', result: 'Survive', color: '#4ade80' },
    { name: '3rd', value: 10, parent: 'Class?', color: '#f87171' },
    { name: '< 10', value: 10, parent: 'Age?', result: 'Survive', color: '#4ade80' },
    { name: '≥ 10', value: 50, parent: 'Age?', result: 'Die', color: '#f87171' },
    { name: 'Age?', value: 10, parent: '3rd', color: '#fcd34d' },
    { name: '< 30', value: 7, parent: 'Age?', result: 'Survive', color: '#4ade80' },
    { name: '≥ 30', value: 3, parent: 'Age?', result: 'Die', color: '#f87171' }
  ];
  
  const sampleRegressionData = [
    { x: 0, y: 0.3 },
    { x: 10, y: 0.35 },
    { x: 20, y: 0.4 },
    { x: 30, y: 0.45 },
    { x: 40, y: 0.5 },
    { x: 50, y: 0.55 },
    { x: 60, y: 0.6 },
    { x: 70, y: 0.65 },
    { x: 80, y: 0.7 }
  ];

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-ocean-dark">Models & Results</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="compare">Model Comparison</TabsTrigger>
            <TabsTrigger value="linear">Linear Regression</TabsTrigger>
            <TabsTrigger value="tree">Decision Tree</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compare">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Model Performance Metrics</CardTitle>
                  <CardDescription>Comparing Linear Regression and Decision Tree classifiers</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatMetricsForBar()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip formatter={(value) => (Number(value) * 100).toFixed(1) + '%'} />
                      <Legend />
                      <Bar dataKey="LinearRegression" name="Linear Regression" fill="#0284c7" />
                      <Bar dataKey="DecisionTree" name="Decision Tree" fill="#0c4a6e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics Table</CardTitle>
                    <CardDescription>Detailed numeric comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead>Linear Regression</TableHead>
                          <TableHead>Decision Tree</TableHead>
                          <TableHead>Winner</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Accuracy</TableCell>
                          <TableCell>{(Number(metrics?.linearRegression.accuracy) * 100).toFixed(1)}%</TableCell>
                          <TableCell>{(Number(metrics?.decisionTree.accuracy) * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            {metrics?.linearRegression.accuracy > metrics?.decisionTree.accuracy ? (
                              <Badge className="bg-blue-500">Linear</Badge>
                            ) : (
                              <Badge className="bg-ocean-dark">Tree</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Precision</TableCell>
                          <TableCell>{(Number(metrics?.linearRegression.precision) * 100).toFixed(1)}%</TableCell>
                          <TableCell>{(Number(metrics?.decisionTree.precision) * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            {metrics?.linearRegression.precision > metrics?.decisionTree.precision ? (
                              <Badge className="bg-blue-500">Linear</Badge>
                            ) : (
                              <Badge className="bg-ocean-dark">Tree</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Recall</TableCell>
                          <TableCell>{(Number(metrics?.linearRegression.recall) * 100).toFixed(1)}%</TableCell>
                          <TableCell>{(Number(metrics?.decisionTree.recall) * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            {metrics?.linearRegression.recall > metrics?.decisionTree.recall ? (
                              <Badge className="bg-blue-500">Linear</Badge>
                            ) : (
                              <Badge className="bg-ocean-dark">Tree</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">F1 Score</TableCell>
                          <TableCell>{(Number(metrics?.linearRegression.f1) * 100).toFixed(1)}%</TableCell>
                          <TableCell>{(Number(metrics?.decisionTree.f1) * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            {metrics?.linearRegression.f1 > metrics?.decisionTree.f1 ? (
                              <Badge className="bg-blue-500">Linear</Badge>
                            ) : (
                              <Badge className="bg-ocean-dark">Tree</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Model Characteristics</CardTitle>
                    <CardDescription>Strengths and weaknesses of each approach</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-ocean">Linear Regression</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Simple, interpretable model</li>
                        <li>Fast to train and make predictions</li>
                        <li>Works well when features have linear relationships with the target</li>
                        <li>Struggles with complex non-linear relationships</li>
                        <li>Not naturally suited for binary classification (needs thresholding)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-ocean-dark">Decision Tree</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Captures non-linear relationships and feature interactions</li>
                        <li>Naturally handles binary classification</li>
                        <li>Easy to interpret visually</li>
                        <li>Can overfit without proper regularization</li>
                        <li>Less stable (small data changes can create different trees)</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Overall:</strong> For the Titanic dataset, the Decision Tree generally outperforms Linear Regression because the survival patterns involve complex interactions between features.
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="linear">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Linear Regression Overview</CardTitle>
                  <CardDescription>How linear regression works for classification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Linear Regression typically predicts continuous values, but can be adapted for binary classification by applying a threshold (usually 0.5) to the output.
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium mb-2 text-ocean-dark">Linear Regression Formula</h3>
                    <p className="text-sm">
                      <code>y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ</code>
                    </p>
                    <p className="text-sm mt-2">
                      Where <code>y</code> is the prediction, <code>β₀</code> is the intercept, and each <code>βᵢ</code> is the coefficient for feature <code>xᵢ</code>.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium mb-2 text-ocean-dark">For Titanic Classification</h3>
                    <p className="text-sm">
                      <code>Survival_Probability = Intercept + (Pclass × β₁) + (Sex × β₂) + (Age × β₃) + ...</code>
                    </p>
                    <p className="text-sm mt-2">
                      If <code>Survival_Probability &gt; 0.5</code>, predict &quot;Survived&quot;, otherwise predict &quot;Died&quot;.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Linear Regression Plot</CardTitle>
                  <CardDescription>Illustrative example of linear regression</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={sampleRegressionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="x" 
                        label={{ value: 'Feature Value', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        domain={[0, 1]} 
                        label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip formatter={(value) => (Number(value) * 100).toFixed(1) + '%'} />
                      <Line type="monotone" dataKey="y" stroke="#0c4a6e" strokeWidth={2} dot={{ r: 4 }} />
                      <Legend />
                      <line 
                        x1={0} 
                        y1={0.5} 
                        x2={80} 
                        y2={0.5} 
                        stroke="red" 
                        strokeDasharray="5 5" 
                        strokeWidth={1} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Feature Coefficients</CardTitle>
                  <CardDescription>Impact of each feature on survival prediction</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Sex (Female)', value: 0.53 },
                        { name: 'Title_Master', value: 0.36 },
                        { name: 'Title_Miss', value: 0.32 },
                        { name: 'Title_Mrs', value: 0.31 },
                        { name: 'HasCabin', value: 0.14 },
                        { name: 'Embarked_C', value: 0.13 },
                        { name: 'Title_Rare', value: 0.12 },
                        { name: 'Embarked_Q', value: 0.05 },
                        { name: 'Intercept', value: 0.042 },
                        { name: 'Fare', value: 0.0023 },
                        { name: 'Age', value: -0.007 },
                        { name: 'IsAlone', value: -0.08 },
                        { name: 'FamilySize', value: -0.02 },
                        { name: 'Embarked_S', value: -0.15 },
                        { name: 'Pclass', value: -0.15 },
                        { name: 'Title_Mr', value: -0.28 }
                      ].sort((a, b) => b.value - a.value)}
                      margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[-0.3, 0.6]} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0284c7">
                        {[
                          { name: 'Sex (Female)', value: 0.53 },
                          { name: 'Title_Master', value: 0.36 },
                          { name: 'Title_Miss', value: 0.32 },
                          { name: 'Title_Mrs', value: 0.31 },
                          { name: 'HasCabin', value: 0.14 },
                          { name: 'Embarked_C', value: 0.13 },
                          { name: 'Title_Rare', value: 0.12 },
                          { name: 'Embarked_Q', value: 0.05 },
                          { name: 'Intercept', value: 0.042 },
                          { name: 'Fare', value: 0.0023 },
                          { name: 'Age', value: -0.007 },
                          { name: 'IsAlone', value: -0.08 },
                          { name: 'FamilySize', value: -0.02 },
                          { name: 'Embarked_S', value: -0.15 },
                          { name: 'Pclass', value: -0.15 },
                          { name: 'Title_Mr', value: -0.28 }
                        ].sort((a, b) => b.value - a.value).map((entry) => (
                          <Cell 
                            key={`cell-${entry.name}`} 
                            fill={entry.value >= 0 ? '#0284c7' : '#f87171'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Positive coefficients increase survival probability, while negative values decrease it. Being female, having high-status titles, and having a cabin record are strong positive indicators for survival. Being male, in 3rd class, or embarking from Southampton reduced survival chances.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tree">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Decision Tree Overview</CardTitle>
                  <CardDescription>How decision trees work for classification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Decision Trees create a flowchart-like structure where each internal node represents a decision based on a feature, each branch represents the outcome of that decision, and each leaf node represents the final classification.
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium mb-2 text-ocean-dark">How Trees Are Built</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      <li>Start with all data at the root node</li>
                      <li>Find the feature that best splits the data (usually based on information gain or Gini impurity)</li>
                      <li>Create branches based on that feature's values</li>
                      <li>Repeat recursively for each branch until stopping criteria are met (e.g., max depth, min samples)</li>
                    </ol>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium mb-2 text-ocean-dark">Benefits for Titanic Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Captures complex survival patterns like "women and children first"</li>
                      <li>Handles feature interactions (e.g., class & gender combined effects)</li>
                      <li>Results in interpretable rules that match historical accounts</li>
                      <li>Doesn't assume linear relationships between features and survival</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Feature Importance</CardTitle>
                  <CardDescription>Most influential features in the Decision Tree model</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Sex', value: 0.42 },
                        { name: 'Pclass', value: 0.25 },
                        { name: 'Age', value: 0.18 },
                        { name: 'Title', value: 0.08 },
                        { name: 'Fare', value: 0.04 },
                        { name: 'FamilySize', value: 0.02 },
                        { name: 'HasCabin', value: 0.01 }
                      ]}
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 0.5]} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => (Number(value) * 100).toFixed(1) + '%'} />
                      <Bar dataKey="value" fill="#0c4a6e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Feature importance shows the relative contribution of each feature in building the tree. Sex is by far the most important predictor, followed by passenger class and age.
                  </p>
                </CardFooter>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Simplified Decision Tree Visualization</CardTitle>
                  <CardDescription>Core structure of the learned decision tree (simplified)</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-4">
                  <div className="max-w-4xl w-full">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 overflow-auto">
                      <svg width="800" height="350" viewBox="0 0 800 350">
                        <line x1="400" y1="30" x2="200" y2="80" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="400" y1="30" x2="600" y2="80" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="200" y1="100" x2="120" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="200" y1="100" x2="280" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="600" y1="100" x2="500" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="600" y1="100" x2="700" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="120" y1="170" x2="120" y2="220" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="280" y1="170" x2="240" y2="220" stroke="#0c4a6e" strokeWidth="2" />
                        <line x1="280" y1="170" x2="320" y2="220" stroke="#0c4a6e" strokeWidth="2" />
                        
                        <rect x="350" y="10" width="100" height="40" rx="5" fill="#0c4a6e" />
                        <text x="400" y="35" textAnchor="middle" fill="white" fontWeight="bold">Sex?</text>
                        
                        <rect x="150" y="80" width="100" height="40" rx="5" fill="#bae6fd" />
                        <text x="200" y="105" textAnchor="middle" fill="#0c4a6e" fontWeight="bold">Female</text>
                        
                        <rect x="550" y="80" width="100" height="40" rx="5" fill="#0ea5e9" />
                        <text x="600" y="105" textAnchor="middle" fill="white" fontWeight="bold">Male</text>
                        
                        <rect x="70" y="150" width="100" height="40" rx="5" fill="#7dd3fc" />
                        <text x="120" y="175" textAnchor="middle" fill="#0c4a6e" fontWeight="bold">Class?</text>
                        
                        <rect x="450" y="150" width="100" height="40" rx="5" fill="#38bdf8" />
                        <text x="500" y="175" textAnchor="middle" fill="#0c4a6e" fontWeight="bold">Age?</text>
                        
                        <rect x="650" y="150" width="100" height="40" rx="5" fill="#f87171" />
                        <text x="700" y="175" textAnchor="middle" fill="white" fontWeight="bold">Mostly Die</text>
                        
                        <rect x="70" y="220" width="100" height="40" rx="5" fill="#4ade80" />
                        <text x="120" y="245" textAnchor="middle" fill="#064e3b" fontWeight="bold">1st/2nd: Live</text>
                        
                        <rect x="190" y="220" width="100" height="40" rx="5" fill="#fcd34d" />
                        <text x="240" y="245" textAnchor="middle" fill="#0c4a6e" fontWeight="bold">3rd: Age?</text>
                        
                        <rect x="400" y="220" width="100" height="40" rx="5" fill="#4ade80" />
                        <text x="450" y="245" textAnchor="middle" fill="#064e3b" fontWeight="bold">Child: Live</text>
                        
                        <rect x="270" y="290" width="100" height="40" rx="5" fill="#4ade80" />
                        <text x="320" y="315" textAnchor="middle" fill="#064e3b" fontWeight="bold">Young: Live</text>
                        
                        <rect x="390" y="290" width="100" height="40" rx="5" fill="#f87171" />
                        <text x="440" y="315" textAnchor="middle" fill="white" fontWeight="bold">Older: Die</text>
                        
                        <text x="150" y="60" textAnchor="middle">Female</text>
                        <text x="650" y="60" textAnchor="middle">Male</text>
                        <text x="120" y="130" textAnchor="middle">1st/2nd/3rd</text>
                        <text x="500" y="130" textAnchor="middle">&lt;10 yrs</text>
                        <text x="700" y="130" textAnchor="middle">≥10 yrs</text>
                        <text x="240" y="200" textAnchor="middle">&lt;30 yrs</text>
                        <text x="320" y="200" textAnchor="middle">≥30 yrs</text>
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      This simplified visualization shows the key decision points in the tree. The most important split is on Sex, followed by passenger class for females and age for males.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ModelResults;
