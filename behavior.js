const projectsConfig = {
  endpoint:
    "https://api-us-east-1.graphcms.com/v2/ckvn1wx1v1qee01xn8z3abjwl/master",
  token:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2MzY3NDI4MTcsImF1ZCI6WyJodHRwczovL2FwaS11cy1lYXN0LTEuZ3JhcGhjbXMuY29tL3YyL2Nrdm4xd3gxdjFxZWUwMXhuOHozYWJqd2wvbWFzdGVyIiwiaHR0cHM6Ly9tYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiYmFlYWY0YmYtNzI2NS00M2MzLWI4ODItNDg3YzhiZTY3YmM3IiwianRpIjoiY2t2d3Fld2pwMzhqMDAxeHc0amIyMmgzNCJ9.ZtIefKBQhTtAY43_-rDE2oUMJ-TimXnzPpGOcUfLrML06g0KHtWCRxofe_QKiyZhgDf-IfH_sQrwpnKvnei-B46_jfNYitnzXGgAfPz0qN9SSVGyxQGQ0C8KPBs2n0lRiLyZsV6gqS_CVeF_PcLuQvqYjrOlY2L-mwy_oQO50Ef1N6FC44-OSiKtquVWE7owi0JeMvZy02XRQJk8S5EBc7VCBwgo52_CdcDGC0IK_zyAfuPJszzlAwmKfCfXqzK-PQzAbMlW3SSKWgyVT3QW8CtFb9X2A17gRO4DFZQ4bdTJ0vDa2VaqAJ33U3V6WCj9GNBwW56IZsJgczaklgPqIitFk0zAFkzBBpvofPkQogwtBVZccE__FEIqXzHjxVzhVxh8t0BQ1X64os8z9gvdhmwdSmonJtgLE4PzJPJKyYtu3W51t5T6QVJ9P58raFofKHNrpgGZk1L1oF6awY6sZHlwklHG4Vv0FuwOGSPWMkmGNSaO6Bi08I5Jegsc_1FEQNydC_MRVSKjg4-xZnKZZZ8wdc8UD9pSVSM-h-OWJmOGtKwMQtpRTzP0OF6VvrBbCihTOuH_o9RbVC5_gRQs2Z7WpLyOswLbi1AHp_OmyEriS2ETup5sAQdE4NDfgATSTqIr5DXT4yMWSkFaZ3DpnUt9o52RhPabNndGnrnMwsU",
};

const init = () => {
  const smartTumbnail = document.getElementById("smart_thumbnail");
  const smartTumbnailIndicator = document.getElementById(
    "smart_thumbnail_indicator"
  );

  const checkSmartTumbnailClass = (classToCheck) => {
    return smartTumbnail.classList.contains(classToCheck);
  };

  const toggleSmartTumbnailClass = () => {
    const isSmartTumbnailSmall = checkSmartTumbnailClass("small");

    if (isSmartTumbnailSmall) {
      smartTumbnail.classList.remove("small");
      smartTumbnailIndicator.innerText =
        "Press the image above to make it smaller";
    } else {
      smartTumbnail.classList.add("small");
      smartTumbnailIndicator.innerText =
        "Press the image above to make it bigger";
    }
  };

  smartTumbnail &&
    smartTumbnail.addEventListener("click", toggleSmartTumbnailClass);
};

document.addEventListener("DOMContentLoaded", init);

const fetchGithubStatistics = async () => {
  const [reponseProfile, responseRepos] = await Promise.all([
    fetch("https://api.github.com/users/yellyoshua", {
      method: "GET",
    }),
    fetch("https://api.github.com/users/yellyoshua/repos", {
      method: "GET",
    }),
  ]);

  const [profile, repos] = await Promise.all([
    reponseProfile.json(),
    responseRepos.json(),
  ]);

  return { ...profile, repos: [...repos] };
};

const renderGithubStatistics = async (elementId) => {
  const {
    name,
    login,
    avatar_url,
    location,
    public_gists,
    public_repos,
    followers,
    following,
    repos,
  } = await fetchGithubStatistics();

  const starsCount = repos.reduce((prev, current) => {
    return prev + current.stargazers_count;
  }, 0);

  const cardItems = [
    { title: "Username", value: login },
    { title: "Location", value: location },
    { title: "Following", value: following },
    { title: "Total stars", value: starsCount },
    { title: "Public Repos", value: public_repos },
    { title: "Public Gits", value: public_gists },
    { title: "Followers", value: followers },
  ];

  const repoContainer = document.createElement("div");
  repoContainer.classList.add("github-container");

  const repoProfileName = document.createElement("h5");
  repoProfileName.innerText = name;

  const repoAvatar = document.createElement("img");
  repoAvatar.classList.add("github-avatar");
  repoAvatar.src = avatar_url;

  {
    const container = document.createElement("div");
    container.classList.add("github-avatar-container");
    container.appendChild(repoAvatar);
    container.appendChild(repoProfileName);
    repoContainer.appendChild(container);
  }

  {
    const container = document.createElement("div");
    container.classList.add("github-statistics");

    cardItems.forEach((item) => {
      const cardContainer = document.createElement("div");
      cardContainer.classList.add("github-statistics-card");

      const cardTitle = document.createElement("h6");
      cardTitle.innerText = item.title;

      const cardValue = document.createElement("p");
      cardValue.innerText = item.value;

      cardContainer.appendChild(cardTitle);
      cardContainer.appendChild(cardValue);
      container.appendChild(cardContainer);
    });

    repoContainer.appendChild(container);
  }

  document.getElementById(elementId).appendChild(repoContainer);
};

const fetchProjects = async () => {
  const response = await fetch(projectsConfig.endpoint, {
    method: "POST",
    headers: { authorization: `Bearer ${projectsConfig.token}` },
    body: JSON.stringify({
      query: `{
        projects {
          id
          title
          description
          repository
          externalLink
        }
      }`,
    }),
  });

  const { data } = await response.json();

  return data ? [...data.projects] : [];
};

const renderProjects = async (elementId) => {
  const projects = await fetchProjects();

  projects.forEach((project) => {
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("projects-container");

    const projectTitle = document.createElement("h3");
    projectTitle.innerText = project.title;

    const projectDescription = document.createElement("p");
    projectDescription.innerText = project.description;

    const projectLinkRepository = document.createElement("a");
    projectLinkRepository.innerText = "Repository";
    projectLinkRepository.target = "_blank";
    projectLinkRepository.href = project.repository;

    projectContainer.appendChild(projectTitle);
    projectContainer.appendChild(projectDescription);
    projectContainer.appendChild(projectLinkRepository);

    document.getElementById(elementId).appendChild(projectContainer);
  });
};

const renderTheLastTweet = (elementId) => {
  const tweets = [
    '<blockquote class="twitter-tweet"><p lang="es" dir="ltr">Piensa en la suerte que tienes de tener lo que tienes. El techo, la cama. Y el apoyo de la gente que te ama. Piensa en la sonrisa de tus amigos, en los consejos de tus padres. En las estrellas y en lo que das. Piensa que hay mas que agradecer que para reprochar.</p>&mdash; Yoshua Lopez (@yellyoshua) <a href="https://twitter.com/yellyoshua/status/1169805440542228481?ref_src=twsrc%5Etfw">September 6, 2019</a></blockquote> ',
    '<blockquote class="twitter-tweet"><p lang="es" dir="ltr">PregÃºntate si lo que estas haciendo hoy te acerca al lugar en el que quieres estar maÃ±ana ... <a href="https://twitter.com/yellyoshua?ref_src=twsrc%5Etfw">@yellyoshua</a></p>&mdash; Yoshua Lopez (@yellyoshua) <a href="https://twitter.com/yellyoshua/status/1267651340060241921?ref_src=twsrc%5Etfw">June 2, 2020</a></blockquote> ',
    '<blockquote class="twitter-tweet"><p lang="es" dir="ltr">Empieza por hacer 1 reflexion<br>Empieza por pagar 1 deuda<br>Empieza por leer 1 pÃ¡gina<br>Empieza por hacer 1 venta<br>Empieza por borrar 1 contacto viejo<br>Empieza por caminar 1 vuelta<br>Empieza por asistir a 1 evento<br>Empieza por escribir un pÃ¡rrafo<br><br>Empieza hoy,<br>Repite maÃ±ana.</p>&mdash; Yoshua Lopez (@yellyoshua) <a href="https://twitter.com/yellyoshua/status/1171904547419250702?ref_src=twsrc%5Etfw">September 11, 2019</a></blockquote> ',
  ];

  const embeedTweets = tweets.join("");

  document.getElementById(elementId).innerHTML = embeedTweets;
};

const renderFollowTwitterButton = (elementId) => {
  const followTwitterButton =
    '<a href="https://twitter.com/yellyoshua?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @yellyoshua</a>';

  document.getElementById(elementId).innerHTML = followTwitterButton;
};

const renderShareOnFacebookButton = (elementId) => {
  const shareOnFacebookButton =
    '<iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Ffacebook.com%2Fbecome.google.developer&layout=button&size=small&width=67&height=20&appId" width="67" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';
  document.getElementById(elementId).innerHTML = shareOnFacebookButton;
};
