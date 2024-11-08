import { useState, useEffect } from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { FiUser } from "react-icons/fi";

export default function ListUser() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');

        if (!response.ok) {
          throw new Error("Erro na requisição");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUsers();
  }, []);

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatTelefone = (telefone) => {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'ativo':
        return <span className="status active">● Ativo</span>;
      case 'inativo':
        return <span className="status inactive">● Inativo</span>;
      case 'aguardando ativacao':
        return <span className="status pending">● Aguardando ativação</span>;
      case 'desativado':
        return <span className="status disabled">● Desativado</span>;
      default:
        return null;
    }
  };

  const handleEdit = (userId) =>{
    navigate(`/editar-usuario/${userId}`)
  }

  return (
    <div className="user-panel">
      <div className="headerForm">
        <FiUser className="icon" />
        <h2>Painel de clientes</h2>
      </div>
      <div className="after-line"></div>
      <div className="header-row">
        <div>
          <h3>Listagem de usuários</h3>
          <p>Escolha um cliente para visualizar os detalhes</p>
        </div>
        <button className="new-client-btn" onClick={() => navigate('/cadastro-usuario')}>Novo cliente</button>
      </div>
      <ul className="user-list">
        {users.map((user, index) => (
          <li key={index} className="user-item">
            <div className="user-content">
              <div className="user-column">
                <h4>{user.nome}</h4>
                <p>{user.email}</p>
              </div>
              <div className="user-column">
                <p>{formatCPF(user.cpf)}</p>
                <p>{formatTelefone(user.telefone)}</p>
              </div>
              <div className="user-column">
                {renderStatus(user.status)}
              </div>
              <div className="user-column">
                <button className="edit-btn" onClick={()=>handleEdit(user.id)} >Editar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="footer-info">Exibindo {users.length} clientes</p>
    </div>
  );
};
