import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '../components/about/HeroSection';
import MissionVision from '../components/about/MissionVision';
import Features from '../components/about/Features';
import HowItWorks from '../components/about/HowItWorks';
import TechStack from '../components/about/TechStack';
import Highlights from '../components/about/Highlights';
import DeveloperProfile from '../components/about/DeveloperProfile';
import Roadmap from '../components/about/Roadmap';
import FAQ from '../components/about/FAQ';
import CTA from '../components/about/CTA';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import '../styles/About.css';
export default function About() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (user && user.isNewUser) {
      apiClient.post('/auth/seen-about')
        .then(response => {
          // If response.data is unwrapped by interceptor:
          const userData = response.data?.user || response.data;
          if (userData && userData.email) {
            setUser(userData);
          } else {
            setUser({ ...user, isNewUser: false });
          }
        })
        .catch(err => {
          console.error('Failed to update seen-about status:', err);
          setUser({ ...user, isNewUser: false });
        });
    }
  }, [user, setUser]);
  return <>
      <Helmet>
        <title>About FinPilot AI - Intelligent Personal Finance Platform</title>
        <meta name="description" content="Learn about FinPilot AI, an intelligent personal finance platform powered by AI to help you manage money smarter, track spending, and achieve financial goals." />
        <meta property="og:title" content="About FinPilot AI" />
        <meta property="og:description" content="Intelligent personal finance management with AI-powered insights and analytics." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="about-page">
        <HeroSection />
        <MissionVision />
        <Features />
        <HowItWorks />
        <TechStack />
        <Highlights />
        <DeveloperProfile />
        <Roadmap />
        <FAQ />
        <CTA />
      </div>
    </>;
}