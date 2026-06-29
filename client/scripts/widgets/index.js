import { HeroWidget } from './hero.widget.js';
import { AboutWidget } from './about.widget.js';
import { ProjectsWidget } from './projects.widget.js';
import { SkillsWidget } from './skills.widget.js';
import { GalleryWidget } from './gallery.widget.js';
import { SocialWidget } from './social.widget.js';
import { ContactWidget } from './contact.widget.js';
import { ResumeWidget } from './resume.widget.js';
import { DividerWidget } from './divider.widget.js';

export const WIDGET_REGISTRY = {
  hero: HeroWidget,
  about: AboutWidget,
  projects: ProjectsWidget,
  skills: SkillsWidget,
  gallery: GalleryWidget,
  social: SocialWidget,
  contact: ContactWidget,
  resume: ResumeWidget,
  divider: DividerWidget,
};

export const WIDGET_ICONS = {
  hero: 'layout',
  about: 'user',
  projects: 'folder-kanban',
  skills: 'bar-chart-3',
  gallery: 'images',
  social: 'share-2',
  contact: 'mail',
  resume: 'file-text',
  divider: 'minus',
};

export const WIDGET_LABELS = {
  hero: 'Hero Section',
  about: 'About Me',
  projects: 'Projects',
  skills: 'Skills',
  gallery: 'Gallery',
  social: 'Social Links',
  contact: 'Contact',
  resume: 'Resume',
  divider: 'Divider',
};

export const createWidget = (type, data = {}) => {
  const WidgetClass = WIDGET_REGISTRY[type];
  if (!WidgetClass) return null;
  return WidgetClass.fromJSON ? WidgetClass.fromJSON(data) : new WidgetClass(data);
};

export const widgetToPayload = (instance, order) => ({
  type: instance.element?.dataset.widgetType || 'hero',
  order,
  visible: true,
  data: instance.toJSON(),
});
