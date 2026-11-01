// Shared helper: computes what % of the profile fields are filled in.
// Used by both the Dashboard stats card and the Profile page.
export function calcProfileCompletion(user) {
  if (!user) return 0;
  const hasName = Boolean((user.name || user.fullName || '').toString().trim());
  const hasEmail = Boolean((user.email || '').toString().trim());
  const hasPhone = Boolean((user.phone || '').toString().trim());
  const hasLocation = Boolean((user.location || '').toString().trim());
  const hasSkills = Boolean((user.skills || '').toString().trim());
  const hasEducation = Boolean((user.education || '').toString().trim());
  const hasExperience = Boolean((user.experience || '').toString().trim());
  const hasResume = Boolean((user.resumeUrl || user.portfolioUrl || '').toString().trim());

  const values = [hasName, hasEmail, hasPhone, hasLocation, hasSkills, hasEducation, hasExperience, hasResume];
  const filled = values.filter(Boolean).length;
  return Math.round((filled / values.length) * 100);
}
