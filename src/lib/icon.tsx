import { type LucideProps, HelpCircle, icons } from 'lucide-react'

/** Resolve a lucide-react icon by its PascalCase name (as stored in data).
 *  Falls back to HelpCircle if the name is unknown, so bad data never crashes
 *  the deck. Usage: <Icon name="FlaskConical" className="size-5" /> */
export function Icon({ name, ...props }: { name?: string } & LucideProps) {
  const Cmp = (name && (icons as Record<string, React.ComponentType<LucideProps>>)[name]) || HelpCircle
  return <Cmp {...props} />
}
