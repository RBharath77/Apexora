import AboutSection from "../components/AboutSection";
import CircuitsWorldSection from "../components/CircuitsWorldSection";
import DriversSection from "../components/DriversSection";
import FanZoneSection from "../components/FanZoneSection";
import Footer from "../components/Footer";
import GarageSection from "../components/GarageSection";
import HeroSection from "../components/HeroSection";
import RaceCalendarSection from "../components/RaceCalendarSection";
import StandingsSection from "../components/StandingsSection";
import StrategySection from "../components/StrategySection";
import TeamsSection from "../components/TeamsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <RaceCalendarSection />
      <StandingsSection />
      <DriversSection />
      <TeamsSection />
      <CircuitsWorldSection />
      <GarageSection />
      <FanZoneSection />
      <StrategySection />
      <AboutSection />
      <Footer />
    </main>
  );
}
