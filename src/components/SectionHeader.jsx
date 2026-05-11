function SectionHeader({ kicker, title, description, actionLabel, actionHref }) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h3>{title}</h3>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <a href={actionHref} className="link-inline">
          {actionLabel}
        </a>
      ) : null}
    </div>
  )
}

export default SectionHeader
