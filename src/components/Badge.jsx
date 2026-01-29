export default function Badge({ variant = 'scheduled', children }) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  )
}
