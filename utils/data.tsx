import Community from "@/svg/community";
import Education from "@/svg/education";
import Growth from "@/svg/growth";
import Gym from "@/svg/gym";
import Integrity from "@/svg/integrity";
import Mindset from "@/svg/mindset";
import Nutrition from "@/svg/nutrition";
import Science from "@/svg/science";
import SupportTeam from "@/svg/supportTeam";
import Workout from "@/svg/workout";

export const menuLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "All Posts",
    link: "/blog/posts",
  },
  {
    title: "About",
    link: "/",
  },
  {
    title: "Contact",
    link: "/",
  },
];

export const categories = [
  {
    id: "category1",
    name: "Fitness",
    image: "/assets/fitness (2).jpg",
    link: "/blog/posts?category=category1",
  },
  {
    id: "category2",
    name: "Nutrition",
    image: "/assets/nutrition.jpg",
    link: "/blog/posts?category=category2",
  },
  {
    id: "category3",
    name: "Health & Wellness",
    image: "/assets/health-wellness.jpg",
    link: "/blog/posts?category=category3",
  },
];

export const offers = [
  {
    icon: <Workout />,
    title: "Workout Guides",
    body: "From beginner-friendly routines to advanced gym splits, we break down exercises for strength, hypertrophy, endurance, and mobility.",
  },
  {
    icon: <Nutrition />,
    title: "Nutrition & Diet Tips",
    body: "Learn about meal planning, macros, supplements, and evidence-based eating strategies for fat loss, muscle gain, and overall wellness.",
  },
  {
    icon: <Gym />,
    title: "Gym Talk & Equipment Reviews",
    body: "Honest breakdowns of the best gear, supplements, and training techniques so you can train smarter.",
  },
  {
    icon: <Science />,
    title: "Science-Based Fitness Insights",
    body: "We cut through the noise with research-driven articles on muscle growth, recovery, and performance.",
  },
  {
    icon: <Mindset />,
    title: "Mindset & Motivation",
    body: "Tips to stay consistent, overcome plateaus, and build sustainable fitness habits for life.",
  },
  {
    icon: <Community />,
    title: "Community & Support",
    body: "Join a growing group of like-minded fitness enthusiasts sharing progress, challenges, and wins!",
  },
];

export const ourTeam = [
  {
    icon: <Gym />,
    title: "Gym rats and Nutritionist ",
    text: "Gym guys who have done it and are ready to push you through.",
  },
  {
    icon: <Education />,
    title: "Educators & Content Creators",
    text: "We work closely with teachers to create exercisable worksheets and learning-based printables.",
  },
  {
    icon: <SupportTeam />,
    title: "Tech & Support Team",
    text: "Ensuring our website runs smoothly and is user-friendly for all visitors.",
  },
];

export const ourvalues = [
  {
    icon: <Integrity />,
    title: "Integrity",
    text: "We maintain strict editorial standards and disclose any affiliations",
  },
  {
    icon: <Mindset />,
    title: "Innovation",
    text: "We constantly explore new formats and topics to serve you better",
  },
  {
    icon: <Community />,
    title: "Community",
    text: "We value our readers' input and encourage thoughtful discussions",
  },
  {
    icon: <Growth />,
    title: "Continuous Improvement",
    text: "We regularly evaluate and enhance our content strategy",
  },
];
