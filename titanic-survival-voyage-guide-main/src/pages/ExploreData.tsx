
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useTitanicData } from '@/services/titanicData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const ExploreData = () => {
  const { data, loading, getBasicStats, getMissingValues, getSurvivalByCategory } = useTitanicData();
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = getBasicStats();
  const missingValues = getMissingValues();
  const survivalByCategory = getSurvivalByCategory();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const SURVIVAL_COLORS = { survived: '#4ade80', died: '#f87171' };
  
  // Generate data for pie charts
  const getPieChartData = (counts: Record<string, number>) => {
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };
  
  // Transform survival by category data for bar charts
  const getSurvivalBarData = (categoryData: Record<string, { total: number, survived: number }>) => {
    return Object.entries(categoryData).map(([category, data]) => ({
      name: category,
      Survived: data.survived,
      Died: data.total - data.survived
    }));
  };
  
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
        <h1 className="text-3xl font-bold mb-6 text-ocean-dark">Data Exploration</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Dataset Overview</TabsTrigger>
            <TabsTrigger value="distributions">Distributions</TabsTrigger>
            <TabsTrigger value="survival">Survival Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Summary</CardTitle>
                  <CardDescription>Basic information about the Titanic dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-ocean-dark">Total Passengers</h3>
                      <p className="text-2xl font-bold">{stats?.totalPassengers}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-ocean-dark">Survived</h3>
                      <p className="text-2xl font-bold">{stats?.survivedCount} ({stats?.survivalRate.toFixed(1)}%)</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-ocean-dark">Age Range</h3>
                      <p className="text-lg">{stats?.ageStats.min} - {stats?.ageStats.max} years</p>
                      <p className="text-sm text-muted-foreground">Average: {stats?.ageStats.average.toFixed(1)} years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Missing Values</CardTitle>
                  <CardDescription>Fields with incomplete data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {missingValues && Object.entries(missingValues).map(([field, count]) => (
                      <div key={field}>
                        <h3 className="font-medium text-ocean-dark">{field}</h3>
                        <div className="flex items-center mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-ocean h-2.5 rounded-full" 
                              style={{ width: `${(count / stats!.totalPassengers) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm">{count} ({((count / stats!.totalPassengers) * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sample Data</CardTitle>
                  <CardDescription>First 5 entries from dataset</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">ID</th>
                        <th className="text-left py-2">Survived</th>
                        <th className="text-left py-2">Class</th>
                        <th className="text-left py-2">Sex</th>
                        <th className="text-left py-2">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 5).map(passenger => (
                        <tr key={passenger.PassengerId} className="border-b">
                          <td className="py-2">{passenger.PassengerId}</td>
                          <td className="py-2">{passenger.Survived === 1 ? 'Yes' : 'No'}</td>
                          <td className="py-2">{passenger.Pclass}</td>
                          <td className="py-2">{passenger.Sex}</td>
                          <td className="py-2">{passenger.Age || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="distributions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Class Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieChartData({
                          "First Class": stats?.classCounts.first || 0,
                          "Second Class": stats?.classCounts.second || 0,
                          "Third Class": stats?.classCounts.third || 0
                        })}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData({
                          "First Class": stats?.classCounts.first || 0,
                          "Second Class": stats?.classCounts.second || 0,
                          "Third Class": stats?.classCounts.third || 0
                        }).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieChartData({
                          "Male": stats?.genderCounts.male || 0,
                          "Female": stats?.genderCounts.female || 0
                        })}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Embarkation Port</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieChartData({
                          "Cherbourg": stats?.embarkedCounts.C || 0,
                          "Queenstown": stats?.embarkedCounts.Q || 0,
                          "Southampton": stats?.embarkedCounts.S || 0,
                          "Unknown": stats?.embarkedCounts.null || 0
                        })}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData({
                          "Cherbourg": stats?.embarkedCounts.C || 0,
                          "Queenstown": stats?.embarkedCounts.Q || 0,
                          "Southampton": stats?.embarkedCounts.S || 0,
                          "Unknown": stats?.embarkedCounts.null || 0
                        }).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Survival Rate</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieChartData({
                          "Survived": stats?.survivedCount || 0,
                          "Died": (stats?.totalPassengers || 0) - (stats?.survivedCount || 0)
                        })}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill={SURVIVAL_COLORS.survived} />
                        <Cell fill={SURVIVAL_COLORS.died} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="survival">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Survival by Passenger Class</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getSurvivalBarData({
                        "First Class": survivalByCategory?.byClass.first || { total: 0, survived: 0 },
                        "Second Class": survivalByCategory?.byClass.second || { total: 0, survived: 0 },
                        "Third Class": survivalByCategory?.byClass.third || { total: 0, survived: 0 }
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Survived" stackId="a" fill={SURVIVAL_COLORS.survived} />
                      <Bar dataKey="Died" stackId="a" fill={SURVIVAL_COLORS.died} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Survival by Gender</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getSurvivalBarData({
                        "Male": survivalByCategory?.byGender.male || { total: 0, survived: 0 },
                        "Female": survivalByCategory?.byGender.female || { total: 0, survived: 0 }
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Survived" stackId="a" fill={SURVIVAL_COLORS.survived} />
                      <Bar dataKey="Died" stackId="a" fill={SURVIVAL_COLORS.died} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Survival by Embarkation Port</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getSurvivalBarData({
                        "Cherbourg (C)": survivalByCategory?.byEmbarked.C || { total: 0, survived: 0 },
                        "Queenstown (Q)": survivalByCategory?.byEmbarked.Q || { total: 0, survived: 0 },
                        "Southampton (S)": survivalByCategory?.byEmbarked.S || { total: 0, survived: 0 }
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Survived" stackId="a" fill={SURVIVAL_COLORS.survived} />
                      <Bar dataKey="Died" stackId="a" fill={SURVIVAL_COLORS.died} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ExploreData;
