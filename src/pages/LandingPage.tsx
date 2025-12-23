import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/ui/status-badge";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  GraduationCap,
  Building2,
  FileUp,
  Video,
  TrendingUp,
  Code,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Role-Based Prep",
    description: "Tailored preparation paths for SDE, Data Analyst, DevOps, ML Engineer, and more.",
  },
  {
    icon: Building2,
    title: "Company-Specific",
    description: "Practice patterns and questions specific to your dream companies.",
  },
  {
    icon: FileUp,
    title: "Criteria Upload",
    description: "Upload company criteria and get personalized prep packs instantly.",
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description: "Simulate real interview rounds with video recording and feedback.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Track your preparation journey with detailed analytics and insights.",
  },
  {
    icon: Code,
    title: "Coding Rounds",
    description: "Practice DSA problems with an integrated code editor and test cases.",
  },
];

const stats = [
  { value: "500+", label: "Practice Problems" },
  { value: "50+", label: "Companies Covered" },
  { value: "10K+", label: "Students Placed" },
  { value: "4.9", label: "User Rating" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE at Google",
    content: "PrepLab helped me crack Google! The company-specific preparation was incredibly accurate.",
    avatar: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Data Analyst at Amazon",
    content: "The criteria upload feature is a game-changer. Got a personalized prep plan in minutes.",
    avatar: "RV",
  },
  {
    name: "Ananya Patel",
    role: "DevOps at Microsoft",
    content: "Mock interviews boosted my confidence. The feedback helped me improve rapidly.",
    avatar: "AP",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeUp}>
              <StatusBadge variant="accent" className="mb-6">
                <Sparkles className="mr-1 h-3 w-3" /> 
                Trusted by 10,000+ students
              </StatusBadge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Ace Your{" "}
              <span className="gradient-text">Placement Interviews</span>{" "}
              With Confidence
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
              The complete interview preparation platform. Practice role-specific questions, 
              simulate real rounds, and get personalized prep packs for your dream companies.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Start Preparing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/companies">
                <Button variant="hero-outline" size="xl">
                  Explore Companies
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border bg-card py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <StatusBadge variant="accent" className="mb-4">
              <Target className="mr-1 h-3 w-3" /> Features
            </StatusBadge>
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to{" "}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Comprehensive tools and resources designed to help you land your dream job.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-accent/50 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <StatusBadge variant="accent" className="mb-4">
              <Zap className="mr-1 h-3 w-3" /> How It Works
            </StatusBadge>
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Your Path to{" "}
              <span className="gradient-text">Success</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "1", title: "Choose Role", desc: "Select your target role" },
              { step: "2", title: "Pick Company", desc: "Choose dream companies" },
              { step: "3", title: "Practice", desc: "MCQ, DSA, Interviews" },
              { step: "4", title: "Get Placed", desc: "Land your dream job" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent font-heading text-xl font-bold text-accent-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <div className="absolute right-0 top-6 hidden h-0.5 w-full translate-x-1/2 bg-border md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-card py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <StatusBadge variant="accent" className="mb-4">
              <Star className="mr-1 h-3 w-3" /> Success Stories
            </StatusBadge>
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              From Students to{" "}
              <span className="gradient-text">Professionals</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border bg-background p-6"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"{testimonial.content}"</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-2xl bg-gradient-hero p-12 text-center"
          >
            <GraduationCap className="mx-auto mb-6 h-16 w-16 text-accent" />
            <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              Join thousands of students who have successfully cracked their dream placements.
            </p>
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
