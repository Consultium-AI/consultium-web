import Navbar from './Navbar'
import { SmoothScroll } from './smoothScroll'
import { LandingHero } from './hero'
import { LandingWaarom } from './waarom'
import { LandingPlatform } from './platform'
import { LandingAiChatBand } from './ai-chat-band'
import { LandingPrijzen } from './prijzen'
import { LandingSlotCta } from './slot-cta'
import { LandingFooter } from './LandingFooter'

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="landing-page min-h-screen">
        <Navbar />
        <main className="relative z-10">
          <LandingHero />
          <LandingWaarom />
          <LandingPlatform />
          <LandingAiChatBand />
          <LandingPrijzen />
          <LandingSlotCta />
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  )
}
