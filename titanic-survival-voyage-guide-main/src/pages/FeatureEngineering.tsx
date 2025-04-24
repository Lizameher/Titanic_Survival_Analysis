
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useTitanicData } from '@/services/titanicData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Check, X, Info } from 'lucide-react';

const FeatureEngineering = () => {
  const { data, loading, processData } = useTitanicData();
  const [activeTab, setActiveTab] = useState('cleaning');
  
  const processedData = processData();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
        </div>
      </Layout>
    );
  }
  
  // Extract titles for visualization
  const getTitles = () => {
    const titles = processedData.map(p => p.Title);
    const titleCounts: Record<string, number> = {};
    titles.forEach(title => {
      if (title) {
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      }
    });
    return Object.entries(titleCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  // Extract family size for visualization
  const getFamilySizes = () => {
    const sizes = processedData.map(p => p.FamilySize);
    const sizeCounts: Record<string, number> = {};
    sizes.forEach(size => {
      if (size) {
        sizeCounts[size.toString()] = (sizeCounts[size.toString()] || 0) + 1;
      }
    });
    return Object.entries(sizeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  };
  
  // Get age bins for visualization
  const getAgeBins = () => {
    const bins = processedData.map(p => p.AgeBin);
    const binCounts: Record<string, number> = {};
    bins.forEach(bin => {
      if (bin) {
        binCounts[bin] = (binCounts[bin] || 0) + 1;
      }
    });
    
    // Order them logically
    const orderedBins = ["Child", "Teenager", "Young Adult", "Adult", "Elderly", "Unknown"];
    return orderedBins.map(bin => ({ name: bin, value: binCounts[bin] || 0 }));
  };
  
  // Get fare bins for visualization
  const getFareBins = () => {
    const bins = processedData.map(p => p.FareBin);
    const binCounts: Record<string, number> = {};
    bins.forEach(bin => {
      if (bin) {
        binCounts[bin] = (binCounts[bin] || 0) + 1;
      }
    });
    
    // Order them logically
    const orderedBins = ["Low", "Medium", "High", "Very High"];
    return orderedBins.map(bin => ({ name: bin, value: binCounts[bin] || 0 }));
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-ocean-dark">Feature Engineering</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="cleaning">Data Cleaning</TabsTrigger>
            <TabsTrigger value="features">Feature Creation</TabsTrigger>
            <TabsTrigger value="encoding">Feature Encoding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cleaning">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Missing Data Strategy</CardTitle>
                  <CardDescription>How we handle incomplete data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Rationale</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Age</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-100">Imputed with Median</Badge>
                        </TableCell>
                        <TableCell>
                          Age is important for survival prediction, but has ~20% missing values. Median provides a reasonable estimate that's robust to outliers.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Cabin</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-amber-100">Convert to Binary</Badge>
                        </TableCell>
                        <TableCell>
                          Too many missing values to impute. Instead, we create a binary flag "HasCabin" which may indicate passenger wealth/status.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Embarked</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100">Imputed with Mode</Badge>
                        </TableCell>
                        <TableCell>
                          Very few missing values. Most passengers embarked from Southampton (S), so we fill missing values with this most common port.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Cleaning Process</CardTitle>
                  <CardDescription>The steps we take to prepare the data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium flex items-center text-ocean-dark">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ocean-dark text-white mr-2">1</span>
                      Identify Missing Values
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      We first analyze which columns have missing data and to what extent. This helps determine the appropriate strategy for each feature.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium flex items-center text-ocean-dark">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ocean-dark text-white mr-2">2</span>
                      Handle Missing Ages
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      For missing ages, we impute with the median age (around 29.7 years). We considered using class or gender-specific medians but opted for simplicity.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium flex items-center text-ocean-dark">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ocean-dark text-white mr-2">3</span>
                      Address Cabin Information
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Since over 75% of Cabin values are missing, we create a binary feature "HasCabin" to indicate if a passenger had a recorded cabin, which may correlate with wealth or status.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium flex items-center text-ocean-dark">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ocean-dark text-white mr-2">4</span>
                      Fix Embarked Ports
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Only a few embarked values are missing. We fill these with "S" (Southampton), the most common port of embarkation.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Before and After Data Cleaning</CardTitle>
                  <CardDescription>Comparing the original and cleaned data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Passenger</TableHead>
                          <TableHead>Original Age</TableHead>
                          <TableHead>Cleaned Age</TableHead>
                          <TableHead>Original Cabin</TableHead>
                          <TableHead>Has Cabin</TableHead>
                          <TableHead>Original Embarked</TableHead>
                          <TableHead>Cleaned Embarked</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.slice(0, 5).map((passenger, idx) => (
                          <TableRow key={passenger.PassengerId}>
                            <TableCell className="font-medium">{passenger.Name.split(',')[0]}</TableCell>
                            <TableCell>{passenger.Age !== null ? passenger.Age : <span className="text-red-500">null</span>}</TableCell>
                            <TableCell>
                              {passenger.Age !== null ? 
                                passenger.Age : 
                                <span className="text-green-500">29.7 (imputed)</span>}
                            </TableCell>
                            <TableCell>{passenger.Cabin !== null ? passenger.Cabin : <span className="text-red-500">null</span>}</TableCell>
                            <TableCell>
                              {passenger.Cabin !== null ? 
                                <Check className="text-green-500" /> : 
                                <X className="text-red-500" />}
                            </TableCell>
                            <TableCell>{passenger.Embarked !== null ? passenger.Embarked : <span className="text-red-500">null</span>}</TableCell>
                            <TableCell>
                              {passenger.Embarked !== null ? 
                                passenger.Embarked : 
                                <span className="text-green-500">S (imputed)</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engineered Features</CardTitle>
                  <CardDescription>New features created to improve model performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>New Feature</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Title</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>
                          Extracted titles (Mr., Mrs., Miss., etc.) from names. These can indicate social status, age, and marital status.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">FamilySize</TableCell>
                        <TableCell>SibSp + Parch</TableCell>
                        <TableCell>
                          Combined siblings/spouses and parents/children, plus self (SibSp + Parch + 1). Family dynamics affected survival chances.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">IsAlone</TableCell>
                        <TableCell>FamilySize</TableCell>
                        <TableCell>
                          Binary feature indicating if passenger was traveling alone (FamilySize = 1). Solo travelers had different survival patterns.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">AgeBin</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>
                          Categorized age into groups (Child, Teenager, Young Adult, Adult, Elderly) to capture non-linear age effects.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">FareBin</TableCell>
                        <TableCell>Fare</TableCell>
                        <TableCell>
                          Grouped fare prices into categories (Low, Medium, High, Very High) to better capture wealth differences.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">HasCabin</TableCell>
                        <TableCell>Cabin</TableCell>
                        <TableCell>
                          Binary indicator for whether Cabin information exists. Proxies for wealth/status as first-class passengers were more likely to have cabin records.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Title Distribution</CardTitle>
                  <CardDescription>Extracted from passenger names</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getTitles().slice(0, 8)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0c4a6e">
                        {getTitles().slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Family Size Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getFamilySizes()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0284c7" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Age Groups</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getAgeBins()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0284c7">
                        {getAgeBins().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="encoding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Encoding</CardTitle>
                  <CardDescription>How categorical features are converted to numerical values</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead>Encoding Method</TableHead>
                        <TableHead>Example</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Sex</TableCell>
                        <TableCell>Binary</TableCell>
                        <TableCell>male → 0, female → 1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Embarked</TableCell>
                        <TableCell>One-Hot</TableCell>
                        <TableCell>
                          C → {"{"}Embarked_C: 1, Embarked_Q: 0, Embarked_S: 0{"}"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Title</TableCell>
                        <TableCell>Grouped + One-Hot</TableCell>
                        <TableCell>
                          Mrs. → {"{"}Title_Mr: 0, Title_Mrs: 1, Title_Miss: 0, Title_Master: 0, Title_Rare: 0{"}"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">IsAlone</TableCell>
                        <TableCell>Binary</TableCell>
                        <TableCell>true → 1, false → 0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">HasCabin</TableCell>
                        <TableCell>Binary</TableCell>
                        <TableCell>true → 1, false → 0</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Why Feature Encoding?</CardTitle>
                  <CardDescription>The importance of converting categorical data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex">
                    <Info className="text-ocean mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">
                      Machine learning models require numerical inputs. Categorical data like "male"/"female" or port names must be converted to numbers.
                    </p>
                  </div>
                  
                  <div className="flex">
                    <Info className="text-ocean mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">
                      <strong>Binary encoding</strong> is used for features with only two possible values, like Sex (male/female) and IsAlone (true/false).
                    </p>
                  </div>
                  
                  <div className="flex">
                    <Info className="text-ocean mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">
                      <strong>One-hot encoding</strong> creates multiple binary columns for categorical features with 3+ values (like Embarked and Title) to avoid implying a numerical relationship.
                    </p>
                  </div>
                  
                  <div className="flex">
                    <Info className="text-ocean mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">
                      <strong>Grouping</strong> is applied to features with many rare values (like Title) to reduce dimensionality while preserving information.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Model-Ready Features</CardTitle>
                  <CardDescription>Example of a passenger record after complete preprocessing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-auto">
                    <h3 className="font-medium mb-2">Original Passenger Data:</h3>
                    <pre className="text-xs bg-slate-100 p-3 rounded">
{`{
  "PassengerId": 1,
  "Survived": 0,
  "Pclass": 3,
  "Name": "Braund, Mr. Owen Harris",
  "Sex": "male",
  "Age": 22,
  "SibSp": 1,
  "Parch": 0,
  "Ticket": "A/5 21171",
  "Fare": 7.25,
  "Cabin": null,
  "Embarked": "S"
}`}
                    </pre>
                    
                    <h3 className="font-medium mt-4 mb-2">Transformed Model Features:</h3>
                    <pre className="text-xs bg-slate-100 p-3 rounded">
{`{
  "Pclass": 3,
  "Sex": 0,
  "Age": 22,
  "Fare": 7.25,
  "Embarked_C": 0,
  "Embarked_Q": 0,
  "Embarked_S": 1,
  "Title_Master": 0,
  "Title_Miss": 0,
  "Title_Mr": 1,
  "Title_Mrs": 0,
  "Title_Rare": 0,
  "FamilySize": 2,
  "IsAlone": 0,
  "HasCabin": 0
}`}
                    </pre>
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

export default FeatureEngineering;
