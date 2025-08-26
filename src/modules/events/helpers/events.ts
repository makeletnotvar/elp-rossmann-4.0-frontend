export function getEventsPriorityName(priorityNumber: number): EventPriority {
  const priorities: { [key: number]: EventPriority } = {
    0: "NONE",
    1: "INFORMATION",
    2: "URGENT",
    3: "CRITICAL",
    4: "LIFE_SAFETY",
  };

  const priority = priorities[priorityNumber] || priorityNumber.toString();

  return priority;
}

export function getBuildingEventsPath(uuid: string): string {
  return `/events-v2/active?F_building=${uuid}&d=desc&o=0&p=activeTs&q=&s=20`;
}

type PrioritiesClassNames = {
  [priority in EventPriority]: string;
};

export function getPriorityClassName(priority: EventPriority, styles: any) {
  const prioritiesClassNames: PrioritiesClassNames = {
    NONE: styles.none,
    INFORMATION: styles.information,
    URGENT: styles.urgent,
    CRITICAL: styles.critical,
    LIFE_SAFETY: styles.lifesafety,
  };

  return prioritiesClassNames[priority] || "";
}
