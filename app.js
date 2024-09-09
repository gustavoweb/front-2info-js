// FETCH da API
const apiUrl = 'https://api-user-2info.vercel.app/api/users';

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); // Carrega os usuários ao abrir a página
});

// Função para buscar usuários e preencher a tabela
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        const users = await response.json();

        const userList = document.getElementById('user-list');
        userList.innerHTML = ''; // Limpa a tabela

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nome}</td>
                <td>${user.usuario}</td>
                <td>${user.senha}</td>
                <td>
                    <button onclick="editUser('${user._id}')">Editar</button>
                    <button onclick="deleteUser('${user._id}')">Excluir</button>
                </td>
            `;
            userList.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

// Função para adicionar ou editar um usuário
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('user-id').value;
    const nome = document.getElementById('nome').value;
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    const userData = { nome, usuario, senha };

    try {
        if (id) {
            // Atualizar usuário existente
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        } else {
            // Criar novo usuário
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        }

        fetchUsers(); // Atualiza a lista de usuários
        document.getElementById('user-form').reset(); // Limpa o formulário
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
    }
});

// Função para preencher o formulário com os dados do usuário para edição
function editUser(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('user-id').value = user._id;
            document.getElementById('nome').value = user.nome;
            document.getElementById('usuario').value = user.usuario;
            document.getElementById('senha').value = ''; // Deixe a senha em branco
        })
        .catch(error => console.error('Erro ao buscar usuário:', error));
}

// Função para excluir um usuário
async function deleteUser(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });
        fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
    }
}
