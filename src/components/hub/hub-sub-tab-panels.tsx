import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useHubSubTab } from "../../hooks/use-hub-sub-tab";
import type { HubSubTabId } from "../../lib/hub-sub-tabs";
import { HubBoothScheduler } from "./hub-booth-scheduler";
import { HubBentoCell } from "./hub-bento-cell";
import { HubDeliverablesCard } from "./hub-deliverables-card";
import { HubProgressChecklist } from "./hub-progress-checklist";
import { HubProjectCard } from "./hub-project-card";
import { HubProjectTimeline } from "./hub-project-timeline";
import { HubSocialPosts } from "./hub-social-posts";
import { HubSponsorFeedback } from "./hub-sponsor-feedback";
import { HubTeamCard } from "./hub-team-card";
import { BuilderTracksSection } from "../builder/builder-tracks-section";

const panelSpring = { type: "spring" as const, stiffness: 100, damping: 20 };

function EquipoPanel() {
  return (
    <>
      <HubBentoCell className="col-span-7" staggerIndex={0}>
        <HubTeamCard />
      </HubBentoCell>
      <HubBentoCell className="col-span-5 row-span-2 self-stretch" staggerIndex={1}>
        <HubProgressChecklist />
      </HubBentoCell>
    </>
  );
}

function ProyectoPanel() {
  return (
    <>
      <HubBentoCell className="col-span-8" staggerIndex={0}>
        <div className="flex flex-col gap-5">
          <HubProjectCard />
          <HubProjectTimeline />
        </div>
      </HubBentoCell>
      <HubBentoCell className="col-span-4" staggerIndex={1}>
        <HubDeliverablesCard />
      </HubBentoCell>
    </>
  );
}

function TracksPanel() {
  return (
    <div className="col-span-12">
      <BuilderTracksSection layout="tab" />
    </div>
  );
}

function EnvioPanel() {
  return (
    <HubBentoCell className="col-span-12" staggerIndex={0}>
      <HubSponsorFeedback />
    </HubBentoCell>
  );
}

function PostsPanel() {
  return (
    <HubBentoCell className="col-span-12" staggerIndex={0}>
      <HubSocialPosts />
    </HubBentoCell>
  );
}

function ReservasPanel() {
  return (
    <HubBentoCell className="col-span-12" staggerIndex={0}>
      <HubBoothScheduler />
    </HubBentoCell>
  );
}

const PANELS: Record<HubSubTabId, () => ReactNode> = {
  equipo: EquipoPanel,
  proyecto: ProyectoPanel,
  tracks: TracksPanel,
  envio: EnvioPanel,
  posts: PostsPanel,
  reservas: ReservasPanel,
};

export function HubSubTabPanels() {
  const { activeSubTab } = useHubSubTab();
  const PanelContent = PANELS[activeSubTab];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSubTab}
        role="tabpanel"
        id={`hub-subtabpanel-${activeSubTab}`}
        aria-labelledby={`hub-subtab-${activeSubTab}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={panelSpring}
        className="grid grid-cols-12 gap-5"
      >
        <PanelContent />
      </motion.div>
    </AnimatePresence>
  );
}
