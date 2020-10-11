const tarefas = require("../models/tarefas.json");
const fs = require("fs");

const getAll = (req, res) => {
  console.log(req.url);
  res.status(200).send(tarefas);
};

const getById = (req, res) => {
  const id = req.params.id;

  res.status(200).send(tarefas.find((tarefa) => tarefa.id == id));
};

const postTarefa = (req, res) => {
  console.log(req.body);
  const { id, dataInclusao, concluido, descricao, nomeColaboradora } = req.body;
  tarefas.push({ id, dataInclusao, concluido, descricao, nomeColaboradora });

  fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefas), 'utf8', function (err) {
    if (err) {
      return res.status(424).send({ message: err });
    }
    console.log("Arquivo atualizado com sucesso!");
  });

  res.status(201).send(tarefas);
};

const deleteTarefa = (req, res) => {
  const id = req.params.id;
  try {
    const tarefaFiltrada = tarefas.find((tarefa) => tarefa.id == id);
    const index = tarefas.indexOf(tarefaFiltrada);
    tarefas.splice(index, 1);

    fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefas), 'utf8', function (err) {
      if (err) {
        return res.status(424).send({ message: err });
      }
      console.log("Arquivo atualizado com sucesso!");
    });

    res.status(200).send(tarefas);
  } catch (err) {
    console.log(err)
    return res.status(424).send({ message: "Erro ao deletar o registro de tarefa" })
  }
};

const deleteTarefaConcluida = (req, res) => {
  const tarefasConcluidas = tarefas.filter(tarefa => tarefa.concluido == true);
  for (i = 0; i < tarefasConcluidas.length; i++) {
    const index = tarefas.indexOf(tarefasConcluidas[i]);
    tarefas.splice(index, 1);
  }

  fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefas), 'utf8', function (err) {
    if (err) {
      return res.status(424).send({ message: err });
    }
    console.log("Arquivo atualizado com sucesso!");
  });

  res.status(200).send(tarefas);
}

const putTarefa = (req, res) => {
  try {
    //Pego o id que foi passado por query param
    const id = req.params.id;

    //Filtro meu array de objetos pra encontrar o objetivo requerido
    const tarefaASerModificada = tarefas.find((tarefa) => tarefa.id == id);
    console.log(tarefaASerModificada);

    //Pego o corpo da requisição com as alterações 
    const tarefaAtualizada = req.body;
    console.log(tarefaAtualizada);

    //Index
    const index = tarefas.indexOf(tarefaASerModificada);
    console.log(index);

    //Buscando no array o endereço, excluindo o registro antigo e substituindo pelo novo 
    tarefas.splice(index, 1, tarefaAtualizada);
    console.log(tarefas);

    fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefas), 'utf8', function (err) {
      if (err) {
        return res.status(424).send({ message: err });
      }
      console.log("Arquivo atualizado com sucesso!");
    });

    res.status(200).send(tarefas);
  } catch (err) {
    return res.status(424).send({ message: err });
  }
}

const patchTarefa = (req, res) => {
  const id = req.params.id;
  const atualizacao = req.body;
  console.log(atualizacao)

  try {
    const tarefaASerModificada = tarefas.find((tarefa) => tarefa.id == id);

    //Ele vai buscar dentro do objeto tarefaASerModificada atributos em que o nome coincida com os do objeto atualizacao, e vai substituir o valor

    Object.keys(atualizacao).forEach((chave) => {
      tarefaASerModificada[chave] = atualizacao[chave]
    })

    fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefas), 'utf8', function(err) {
      if (err) {
        return res.status(424).send({ message: err});
      }
      console.log("Arquivo atualizado com sucesso!")
    });

    return res.status(200).send(tarefas);
  } catch(err) {
    return res.status(424).send({ message: err });
  }
}

module.exports = {
  getAll,
  getById,
  postTarefa,
  deleteTarefa,
  deleteTarefaConcluida,
  putTarefa,
  patchTarefa
};
