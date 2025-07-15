import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Eye, Hand, Scan, Smartphone, Brain, Zap } from "lucide-react";
import heroRoom from "@/assets/hero-room.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              SpaceDesign
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="font-medium">
                How it Works
              </Button>
              <Button variant="ghost" className="font-medium">
                Features
              </Button>
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Furniture Discovery
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
                  Transform Your
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> Space </span>
                  with AI & AR
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Experience the future of furniture shopping with AI curation, 3D visualization, 
                  and revolutionary hand-tracking technology in augmented reality.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" className="group">
                  Start Designing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="glass" size="xl">
                  <Eye className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm">
                  <Brain className="w-4 h-4 text-primary" />
                  AI Curation
                </div>
                <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm">
                  <Hand className="w-4 h-4 text-accent" />
                  Hand Tracking
                </div>
                <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm">
                  <Scan className="w-4 h-4 text-secondary" />
                  3D Visualization
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative animate-fade-in">
              <div className="relative">
                <img 
                  src={heroRoom} 
                  alt="AI-powered room visualization" 
                  className="w-full rounded-3xl shadow-luxury border border-white/10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-3xl" />
                
                {/* Floating UI Elements */}
                <div className="absolute top-6 right-6 animate-float">
                  <Card className="p-4 bg-card/90 backdrop-blur-md border-white/20 shadow-glow">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full animate-glow-pulse"></div>
                      <span className="text-sm font-medium">AI Scanning...</span>
                    </div>
                  </Card>
                </div>
                
                <div className="absolute bottom-6 left-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <Card className="p-4 bg-card/90 backdrop-blur-md border-white/20 shadow-card">
                    <div className="text-sm font-medium text-accent">Match: 98%</div>
                    <div className="text-xs text-muted-foreground">Perfect for your style</div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold">
              Revolutionary Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge AI, AR technology, and intuitive design 
              to reimagine how you discover and place furniture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Curation */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-white/10 shadow-card hover:shadow-luxury transition-all duration-500 group">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">AI-Powered Curation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our AI scans thousands of products and learns your preferences 
                    to recommend furniture that perfectly matches your style and space.
                  </p>
                </div>
              </div>
            </Card>

            {/* AR Visualization */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-white/10 shadow-card hover:shadow-luxury transition-all duration-500 group">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">AR Visualization</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    See exactly how furniture will look in your space using advanced 
                    augmented reality before making any purchase decisions.
                  </p>
                </div>
              </div>
            </Card>

            {/* Hand Tracking */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-white/10 shadow-card hover:shadow-luxury transition-all duration-500 group">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Hand className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Hand Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Interact naturally with furniture in AR using revolutionary 
                    hand tracking technology. Move, rotate, and place items with gestures.
                  </p>
                </div>
              </div>
            </Card>

            {/* 3D Modeling */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-white/10 shadow-card hover:shadow-luxury transition-all duration-500 group">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scan className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">3D Room Modeling</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create accurate 3D models of your actual room dimensions 
                    and see realistic furniture placement and lighting.
                  </p>
                </div>
              </div>
            </Card>

            {/* Smart Recommendations */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-white/10 shadow-card hover:shadow-luxury transition-all duration-500 group">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Smart Discovery</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Swipe through curated furniture recommendations that match 
                    your style, budget, and room requirements perfectly.
                  </p>
                </div>
              </div>
            </Card>

            {/* Mobile Experience */}
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-white/10 shadow-card hover:shadow-luxury transition-all duration-500 group">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Mobile-First AR</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Seamless mobile experience with real-time AR rendering 
                    and intuitive touch controls for the ultimate convenience.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 bg-gradient-card backdrop-blur-sm border-white/10 shadow-luxury text-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-display font-bold">
                Ready to Transform Your Space?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join the future of furniture shopping and experience design like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="hero" size="xl" className="group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="glass" size="xl">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
