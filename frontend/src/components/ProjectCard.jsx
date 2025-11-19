const ProjectCard = ({ project }) => (
  <article className="section">
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          Repo
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer">
          Live
        </a>
      )}
    </div>
  </article>
);

export default ProjectCard;
