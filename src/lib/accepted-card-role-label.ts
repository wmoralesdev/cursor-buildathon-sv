export function acceptedCardRoleLabel(isLeadOrganizer?: boolean): string {
  return isLeadOrganizer ? "Lead organizer" : "Accepted builder";
}
