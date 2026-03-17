import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { usePaymentStore } from "@/lib/store";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  CreditCard,
  Wallet,
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Clock,
  Gift,
  TrendingUp,
  Star,
  IndianRupee,
  Lock,
  BadgePercent,
  ChevronRight,
} from "lucide-react";

type PaymentMethod = "upi" | "card" | "wallet";

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Starter",
    price: 199,
    originalPrice: 499,
    duration: "1 month",
    features: ["100 MCQ questions", "5 DSA problems", "Basic analytics"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    originalPrice: 1299,
    duration: "3 months",
    features: [
      "Unlimited MCQs",
      "50 DSA problems",
      "Mock interviews",
      "Company-specific prep",
      "Detailed analytics",
    ],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 999,
    originalPrice: 2499,
    duration: "6 months",
    features: [
      "Everything in Pro",
      "1-on-1 mentorship",
      "Resume review",
      "Priority support",
      "Lifetime access to recordings",
    ],
  },
];

const paymentMethods: {
  id: PaymentMethod;
  name: string;
  icon: React.ElementType;
  description: string;
  processingTime: string;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "upi",
    name: "UPI",
    icon: Smartphone,
    description: "Pay instantly via Google Pay, PhonePe, Paytm",
    processingTime: "Instant",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    id: "card",
    name: "Card",
    icon: CreditCard,
    description: "Credit or Debit card with EMI options",
    processingTime: "2-3 seconds",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "wallet",
    name: "Wallet",
    icon: Wallet,
    description: "Use your PrepLab wallet balance",
    processingTime: "Instant",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

function getRecommendationReason(
  method: PaymentMethod,
  amount: number,
  walletBalance: number
): string {
  if (method === "wallet" && walletBalance >= amount) {
    return "Fastest checkout - use your existing balance";
  }
  if (method === "upi") {
    return "Most popular for this amount - instant & secure";
  }
  return "Best for larger amounts - EMI available";
}

function getMethodBenefits(
  method: PaymentMethod,
  amount: number,
  walletBalance: number
): { label: string; icon: React.ElementType }[] {
  switch (method) {
    case "upi":
      return [
        { label: "Zero transaction fees", icon: BadgePercent },
        { label: "Instant confirmation", icon: Zap },
        { label: "No card details needed", icon: Shield },
      ];
    case "card":
      return [
        { label: "EMI available on orders above 500", icon: TrendingUp },
        { label: "Extra 5% cashback on credit cards", icon: Gift },
        { label: "Secured with 3D authentication", icon: Lock },
      ];
    case "wallet":
      return [
        {
          label: `Balance: ${walletBalance >= amount ? "Sufficient" : "Insufficient"} (${walletBalance})`,
          icon: Wallet,
        },
        { label: "One-tap payment", icon: Zap },
        { label: "Earn 2% cashback to wallet", icon: Gift },
      ];
  }
}

export default function PaymentPage() {
  const {
    selectedPlan,
    amount,
    selectedMethod,
    wallet,
    setPlan,
    setMethod,
    getRecommendedMethod,
  } = usePaymentStore();

  const [step, setStep] = useState<"plan" | "payment" | "confirm">("plan");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const recommended = amount > 0 ? getRecommendedMethod() : null;

  useEffect(() => {
    if (step === "payment" && !selectedMethod && recommended) {
      setMethod(recommended);
    }
  }, [step, selectedMethod, recommended, setMethod]);

  const handlePlanSelect = (plan: Plan) => {
    setPlan(plan.id, plan.price);
    setStep("payment");
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep("confirm");
          setIsProcessing(false);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const isPaymentFormValid = () => {
    if (!selectedMethod) return false;
    switch (selectedMethod) {
      case "upi":
        return upiId.includes("@");
      case "card":
        return (
          cardNumber.replace(/\s/g, "").length === 16 &&
          cardExpiry.length === 5 &&
          cardCvv.length === 3 &&
          cardName.length > 0
        );
      case "wallet":
        return wallet.balance >= amount;
      default:
        return false;
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const discount = selectedPlanData
    ? Math.round(
        ((selectedPlanData.originalPrice - selectedPlanData.price) /
          selectedPlanData.originalPrice) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <StatusBadge variant="accent" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Smart Checkout
            </StatusBadge>
            <h1 className="mb-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {step === "plan" && "Choose Your Plan"}
              {step === "payment" && "Select Payment Method"}
              {step === "confirm" && "Payment Successful!"}
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {step === "plan" &&
                "Unlock your full interview preparation potential"}
              {step === "payment" &&
                "We recommend the best option based on your order"}
              {step === "confirm" &&
                "Your premium plan is now active. Start preparing!"}
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-center gap-2">
              {["plan", "payment", "confirm"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all",
                      step === s || ["plan", "payment", "confirm"].indexOf(step) > i
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {["plan", "payment", "confirm"].indexOf(step) > i ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 2 && (
                    <div
                      className={cn(
                        "h-0.5 w-12 transition-all sm:w-20",
                        ["plan", "payment", "confirm"].indexOf(step) > i
                          ? "bg-accent"
                          : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-8 text-xs text-muted-foreground sm:gap-16">
              <span>Plan</span>
              <span>Payment</span>
              <span>Done</span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step 1: Plan Selection */}
            {step === "plan" && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid gap-6 md:grid-cols-3"
              >
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4 }}
                    className={cn(
                      "relative flex flex-col rounded-xl border p-6 shadow-card transition-all",
                      plan.popular
                        ? "border-accent bg-card shadow-lg"
                        : "border-border bg-card hover:border-accent/50"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <StatusBadge variant="accent">
                          <Star className="mr-1 h-3 w-3" />
                          Most Popular
                        </StatusBadge>
                      </div>
                    )}

                    <div className="mb-4 text-center">
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.duration}
                      </p>
                    </div>

                    <div className="mb-6 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <IndianRupee className="h-5 w-5 text-foreground" />
                        <span className="font-heading text-4xl font-bold text-foreground">
                          {plan.price}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="line-through">
                          {plan.originalPrice}
                        </span>{" "}
                        <span className="font-medium text-success">
                          {Math.round(
                            ((plan.originalPrice - plan.price) /
                              plan.originalPrice) *
                              100
                          )}
                          % off
                        </span>
                      </p>
                    </div>

                    <ul className="mb-6 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={plan.popular ? "accent" : "outline"}
                      className="w-full"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      Select Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Step 2: Payment Method Selection */}
            {step === "payment" && selectedPlanData && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid gap-6 lg:grid-cols-5"
              >
                {/* Left: Order Summary */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">
                      Order Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium text-foreground">
                          {selectedPlanData.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">
                          {selectedPlanData.duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="text-muted-foreground line-through">
                          {selectedPlanData.originalPrice}
                        </span>
                      </div>
                      <div className="flex justify-between text-success">
                        <span>Discount ({discount}%)</span>
                        <span>
                          -
                          {selectedPlanData.originalPrice -
                            selectedPlanData.price}
                        </span>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground">
                            Total
                          </span>
                          <span className="flex items-center font-heading text-xl font-bold text-foreground">
                            <IndianRupee className="h-4 w-4" />
                            {selectedPlanData.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    <Shield className="h-5 w-5 shrink-0 text-accent" />
                    <span>
                      256-bit SSL encrypted. Your payment details are safe.
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep("plan");
                      setMethod(null);
                    }}
                  >
                    Change Plan
                  </Button>
                </div>

                {/* Right: Payment Methods */}
                <div className="space-y-4 lg:col-span-3">
                  {/* Smart Recommendation Banner */}
                  {recommended && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4"
                    >
                      <div className="rounded-lg bg-accent/10 p-2">
                        <Zap className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          Recommended:{" "}
                          {
                            paymentMethods.find((m) => m.id === recommended)
                              ?.name
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRecommendationReason(
                            recommended,
                            amount,
                            wallet.balance
                          )}
                        </p>
                      </div>
                      <StatusBadge variant="accent">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Smart Pick
                      </StatusBadge>
                    </motion.div>
                  )}

                  {/* Payment Method Cards */}
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const isSelected = selectedMethod === method.id;
                      const isRecommended = recommended === method.id;
                      const isDisabled =
                        method.id === "wallet" &&
                        wallet.balance < amount;

                      return (
                        <motion.div
                          key={method.id}
                          whileHover={!isDisabled ? { scale: 1.01 } : undefined}
                          whileTap={!isDisabled ? { scale: 0.99 } : undefined}
                        >
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setMethod(method.id)}
                            className={cn(
                              "w-full rounded-xl border p-4 text-left transition-all",
                              isSelected
                                ? "border-accent bg-accent/5 shadow-md"
                                : "border-border bg-card hover:border-accent/30",
                              isDisabled && "cursor-not-allowed opacity-50"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "rounded-lg p-3 transition-colors",
                                  isSelected
                                    ? "bg-accent text-accent-foreground"
                                    : method.bgColor + " " + method.color
                                )}
                              >
                                <method.icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">
                                    {method.name}
                                  </span>
                                  {isRecommended && (
                                    <StatusBadge variant="accent">
                                      Recommended
                                    </StatusBadge>
                                  )}
                                  {isDisabled && (
                                    <StatusBadge variant="destructive">
                                      Insufficient balance
                                    </StatusBadge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {method.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {method.processingTime}
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-5 w-5 transition-transform",
                                  isSelected
                                    ? "rotate-90 text-accent"
                                    : "text-muted-foreground"
                                )}
                              />
                            </div>
                          </button>

                          {/* Expanded Payment Form */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="rounded-b-xl border border-t-0 border-accent/20 bg-card p-5">
                                  {/* Benefits */}
                                  <div className="mb-4 grid gap-2 sm:grid-cols-3">
                                    {getMethodBenefits(
                                      method.id,
                                      amount,
                                      wallet.balance
                                    ).map((benefit) => (
                                      <div
                                        key={benefit.label}
                                        className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground"
                                      >
                                        <benefit.icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                                        <span>{benefit.label}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* UPI Form */}
                                  {method.id === "upi" && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                                          UPI ID
                                        </label>
                                        <Input
                                          placeholder="yourname@upi"
                                          value={upiId}
                                          onChange={(e) =>
                                            setUpiId(e.target.value)
                                          }
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                          Enter your UPI ID (e.g.,
                                          name@okicici, name@ybl)
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {[
                                          "Google Pay",
                                          "PhonePe",
                                          "Paytm",
                                          "BHIM",
                                        ].map((app) => (
                                          <button
                                            key={app}
                                            type="button"
                                            className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                                          >
                                            {app}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Card Form */}
                                  {method.id === "card" && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                                          Card Number
                                        </label>
                                        <Input
                                          placeholder="1234 5678 9012 3456"
                                          value={cardNumber}
                                          maxLength={19}
                                          onChange={(e) =>
                                            setCardNumber(
                                              formatCardNumber(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                                          Cardholder Name
                                        </label>
                                        <Input
                                          placeholder="Name on card"
                                          value={cardName}
                                          onChange={(e) =>
                                            setCardName(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                                            Expiry
                                          </label>
                                          <Input
                                            placeholder="MM/YY"
                                            value={cardExpiry}
                                            maxLength={5}
                                            onChange={(e) =>
                                              setCardExpiry(
                                                formatExpiry(e.target.value)
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                                            CVV
                                          </label>
                                          <Input
                                            type="password"
                                            placeholder="***"
                                            value={cardCvv}
                                            maxLength={3}
                                            onChange={(e) =>
                                              setCardCvv(
                                                e.target.value.replace(
                                                  /\D/g,
                                                  ""
                                                )
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Wallet Form */}
                                  {method.id === "wallet" && (
                                    <div className="space-y-4">
                                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm font-medium text-foreground">
                                              Wallet Balance
                                            </p>
                                            <p className="flex items-center font-heading text-2xl font-bold text-foreground">
                                              <IndianRupee className="h-5 w-5" />
                                              {wallet.balance}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm text-muted-foreground">
                                              Cashback earned
                                            </p>
                                            <p className="flex items-center justify-end gap-1 text-sm font-medium text-success">
                                              <Gift className="h-3.5 w-3.5" />
                                              {wallet.cashback} this month
                                            </p>
                                          </div>
                                        </div>
                                        {wallet.balance >= amount && (
                                          <div className="mt-3 flex items-center gap-2 text-xs text-success">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Sufficient balance for this
                                            purchase. You'll earn{" "}
                                            {Math.round(amount * 0.02)}{" "}
                                            cashback!
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pay Button */}
                  <div className="pt-2">
                    {isProcessing ? (
                      <div className="space-y-3">
                        <Progress value={processingProgress} className="h-3" />
                        <p className="text-center text-sm text-muted-foreground">
                          Processing your payment...
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="hero"
                        size="lg"
                        className="w-full"
                        disabled={!isPaymentFormValid()}
                        onClick={handlePayment}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Pay{" "}
                        <span className="mx-1 flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {amount}
                        </span>{" "}
                        with{" "}
                        {paymentMethods.find((m) => m.id === selectedMethod)
                          ?.name || "..."}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === "confirm" && selectedPlanData && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-lg text-center"
              >
                <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
                  >
                    <CheckCircle className="h-10 w-10 text-success" />
                  </motion.div>

                  <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
                    Payment Successful!
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    Your {selectedPlanData.name} plan is now active for{" "}
                    {selectedPlanData.duration}
                  </p>

                  <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 text-left">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Plan
                        </span>
                        <span className="font-medium text-foreground">
                          {selectedPlanData.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Amount Paid
                        </span>
                        <span className="flex items-center font-medium text-foreground">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {selectedPlanData.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Payment Method
                        </span>
                        <span className="font-medium text-foreground">
                          {
                            paymentMethods.find(
                              (m) => m.id === selectedMethod
                            )?.name
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          You Saved
                        </span>
                        <span className="font-medium text-success">
                          {selectedPlanData.originalPrice -
                            selectedPlanData.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="accent"
                      className="flex-1"
                      onClick={() => {
                        window.location.href = "/dashboard";
                      }}
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        window.location.href = "/prep-pack";
                      }}
                    >
                      Start Preparing
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
