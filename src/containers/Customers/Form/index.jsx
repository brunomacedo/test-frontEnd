import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid';

import './form.sass';

import userIcon from '../../../assets/images/user.png';
import arrow from '../../../assets/images/arrow.png';
import Loading from '../../../components/Loading';
import Container from '../../../components/Container';
import {
  formatCPF, formatPhone, validateCPF, validateEmail,
} from '../../../helpers';
import {
  loadCustomers,
  addCustomer,
  updateCustomer,
} from '../../../store/actions/customers';

class CustomersForm extends Component {
  state = {
    editing: false,
    loading: true,
    customer: {
      _id: String(),
      name: String(),
      cpf: String(),
      contact: {
        email: String(),
        tel: String(),
      },
      status: String(),
    },
    validators: {
      cpf: false,
      email: false,
      tel: false,
    },
  }

  async componentDidMount() {
    const { customers, loadCustomers: propsLoadCustomers } = this.props;

    if (customers.length === 0) {
      await propsLoadCustomers();
    }

    this.setState({ loading: false });
    this.onPageLoad();
  }

  onPageLoad = () => {
    const { customers, match, history } = this.props;

    const customer = customers.find(({ _id }) => (
      _id.toString() === match.params.id.toString()
    ));

    if (customer) {
      this.setState({
        editing: true,
        customer,
      });
    } else {
      history.push('/clientes/novo');
      this.setState(prevState => ({
        customer: {
          ...prevState.customer,
          _id: uuid(),
        },
      }));
    }
  }

  onHandleFormatters = (name, value) => ({
    cpf: formatCPF(value),
    tel: formatPhone(value),
  }[name] || value)

  onHandleValidator = (name, value) => ({
    cpf: !validateCPF(value) && value !== '',
    email: !validateEmail(value),
    tel: value.length < 14 && value !== '',
  }[name] || false)

  onHandleChangeOne = ({ target }) => {
    const { value, name } = target;

    this.setState(prevState => ({
      customer: {
        ...prevState.customer,
        [name]: this.onHandleFormatters(name, value),
      },
      validators: {
        ...prevState.validators,
        [name]: this.onHandleValidator(name, value),
      },
    }));
  }

  onHandleChangeLevel = ({ target }) => {
    const { value, name } = target;

    this.setState(prevState => ({
      customer: {
        ...prevState.customer,
        contact: {
          ...prevState.customer.contact,
          [name]: this.onHandleFormatters(name, value),
        },
      },
      validators: {
        ...prevState.validators,
        [name]: this.onHandleValidator(name, value),
      },
    }));
  }

  onHandleSubmit = (e) => {
    e.preventDefault();
    const {
      addCustomer: propsAddCustomer,
      updateCustomer: propsUpdateCustomer,
      history,
    } = this.props;
    const { customer, editing, validators } = this.state;
    const blockSend = Object.keys(validators).filter(item => validators[item]);
    // const { _id: itemID } = customer;

    if (blockSend.length > 0) return;

    if (!editing) {
      propsAddCustomer(customer);
      // history.push(`/clientes/${itemID}`);
      this.setState({
        editing: true,
        loading: false,
      });
    } else {
      propsUpdateCustomer(customer);
    }

    history.push('/clientes');
  }

  render() {
    const {
      loading, editing, customer, validators,
    } = this.state;

    const {
      cpf: isCPF,
      email: isEmail,
      tel: isTel,
    } = validators;

    const {
      name, contact, cpf, status,
    } = customer;

    const {
      email, tel,
    } = contact;

    return (
      <Container
        header={{
          icon: userIcon,
          component: 'h1',
          text: 'Painel de clientes',
        }}
        subHeader={{
          title: `${editing ? 'Editar' : 'Novo'} usuário`,
          description: `Informe os campos a seguir para ${editing ? 'editar' : 'criar novo'} usuário:`,
        }}
      >
        {!loading ? (
          <form className="page-form" onSubmit={this.onHandleSubmit}>
            <input value={name} name="name" onChange={this.onHandleChangeOne} placeholder="Nome" type="text" required />
            <input value={email} name="email" onChange={this.onHandleChangeLevel} placeholder="E-mail" type="text" required />
            {isEmail && <span className="field-error">E-mail inválido.</span>}
            <input value={cpf} name="cpf" onChange={this.onHandleChangeOne} placeholder="CPF" type="text" maxLength="14" />
            {isCPF && <span className="field-error">CPF inválido.</span>}
            <input value={tel} name="tel" onChange={this.onHandleChangeLevel} placeholder="Telefone" type="text" maxLength="15" />
            {isTel && <span className="field-error">Telefone inválido.</span>}
            <div className="selectForm">
              <select name="status" value={status} onChange={this.onHandleChangeOne}>
                <option>Status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Aguardando ativação">Aguardando ativação</option>
                <option value="Desativado">Desativado</option>
              </select>
              <img src={arrow} alt="" />
            </div>
            <footer className="buttons">
              <button
                type="submit"
                className="btn btn--theme"
              >
                {editing ? 'Salvar' : 'Criar'}
              </button>
              <Link to="/" className="btn btn--white">
                Voltar
              </Link>
            </footer>
          </form>
        ) : (
          <Loading />
        )}
      </Container>
    );
  }
}

CustomersForm.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  customers: PropTypes.instanceOf(Object).isRequired,
  loadCustomers: PropTypes.func.isRequired,
  addCustomer: PropTypes.func.isRequired,
  updateCustomer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  customers: state.customersReducer.customers,
});

export default connect(mapStateToProps, {
  loadCustomers, addCustomer, updateCustomer,
})(CustomersForm);
