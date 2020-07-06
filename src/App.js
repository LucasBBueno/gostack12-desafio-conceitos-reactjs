import React, {useState, useEffect} from "react";

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then((response) => {
      setRepositories(response.data);
    })
  }, []);

  async function handleAddRepository() {
     const repository = {
        title: `Repository ${Date.now()}`,
        url: "teste.localhost",
        techs: ["ReactJS", "React Native"]
     }

     const response = await api.post('repositories', repository);

     setRepositories([...repositories, response.data]);
  }

  async function handleLikeRepository(id){
    const response = await api.post(`repositories/${id}/like`);

    if(response.status !== 400) {
      const repositoryUpdated = response.data;

      const repositoriesUpdated = repositories.map(repository => 
        repository.id === repositoryUpdated.id
        ? repositoryUpdated
        : repository
      );

      setRepositories(repositoriesUpdated);
    }

  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);

    if(response.status === 204){ //Status 204 pois foi o retorno do sucesso da remoção
      //Uso filter para gera um novo array menos o elemento que foi removido
      const repositoriesFilter = repositories.filter(repository => repository.id !== id);
      setRepositories(repositoriesFilter);
    }
  }

  return (
    <div className="mainContainer">
      <ul className="repositoryList" data-testid="repository-list">
      {repositories.map(repository => (
        <li className="repositoryItem" key={repository.id}>

          <div className="repositoryInfoContainer">
            <label>{repository.title}</label>
            <label>{repository.likes} { repository.likes === 1 ? 'curtida' : 'curtidas'}</label>
            
          </div>
          <button className="buttonLike" onClick={() => handleLikeRepository(repository.id)}>
            Curtir
          </button>
          <button className="buttonRemove" onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
          
        </li>
      ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
