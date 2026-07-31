// Refactored skill handling logic with improved structure

export class SkillManager {
  private skills: Map<string, any> = new Map();

  addSkill(name: string, skill: any): void {
    this.skills.set(name, skill);
  }

  getSkill(name: string): any | undefined {
    return this.skills.get(name);
  }

  removeSkill(name: string): void {
    this.skills.delete(name);
  }

  listSkills(): string[] {
    return Array.from(this.skills.keys());
  }
}
