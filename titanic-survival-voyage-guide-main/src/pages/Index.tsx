
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Ship, Database, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useTitanicData } from '@/services/titanicData';

const Index = () => {
  const navigate = useNavigate();
  const { getBasicStats, loading } = useTitanicData();
  const stats = getBasicStats();

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center">
            <Ship className="h-12 w-12 text-ocean mr-3" />
            <h1 className="text-4xl font-bold text-ocean">Titanic Survival Analysis</h1>
          </div>
          <p className="text-xl mt-4 max-w-2xl text-slate-600">
            An interactive machine learning project that analyzes the Titanic dataset and predicts passenger survival outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="ocean-wave-bg rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-4 text-ocean-dark">About the Titanic Disaster</h2>
            <p className="text-slate-700 mb-4">
              On April 15, 1912, the widely considered "unsinkable" RMS Titanic sank after colliding with an iceberg during her maiden voyage. Unfortunately, there weren't enough lifeboats for everyone on board, resulting in the death of 1,502 out of 2,224 passengers and crew.
            </p>
            <p className="text-slate-700">
              In this analysis, we explore what factors made people more likely to survive and build predictive models using machine learning techniques.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-ocean-dark text-center">Dataset Overview</h2>
            
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean"></div>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-slate-600">Total Passengers</p>
                  <p className="text-2xl font-bold text-ocean-dark">{stats.totalPassengers}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-slate-600">Survival Rate</p>
                  <p className="text-2xl font-bold text-ocean-dark">{stats.survivalRate.toFixed(1)}%</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-slate-600">Avg. Age</p>
                  <p className="text-2xl font-bold text-ocean-dark">{stats.ageStats.average.toFixed(1)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-slate-600">Gender Ratio</p>
                  <p className="text-2xl font-bold text-ocean-dark">{Math.round(stats.genderCounts.male / stats.genderCounts.female * 10) / 10}:1</p>
                  <p className="text-xs text-slate-500">male:female</p>
                </div>
              </div>
            ) : (
              <p>Failed to load statistics</p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center text-ocean-dark">Explore Our Analysis Workflow</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-ocean" />
                Data Exploration
              </CardTitle>
              <CardDescription>Examine the dataset characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View descriptive statistics, distributions, and relationships between variables in the Titanic dataset.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/explore')}
              >
                Explore Data
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-ocean" />
                Feature Engineering
              </CardTitle>
              <CardDescription>Prepare data for modeling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn how we clean missing values and create new features to improve model performance.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/features')}
              >
                View Features
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-ocean" />
                Models & Results
              </CardTitle>
              <CardDescription>Compare prediction models</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Examine how Linear Regression and Decision Tree models perform on the Titanic survival prediction task.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/models')}
              >
                See Results
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ship className="h-5 w-5 mr-2 text-ocean" />
                Try Prediction
              </CardTitle>
              <CardDescription>Test the models interactively</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create hypothetical passengers and see if our models predict their survival on the Titanic.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/predict')}
              >
                Make Predictions
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            className="group"
            onClick={() => navigate('/explore')}
          >
            Start Exploring
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
