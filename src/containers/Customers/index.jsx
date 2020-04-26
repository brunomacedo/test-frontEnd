import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import userIcon from '../../assets/images/user.png';
import Container from '../../components/Container';
import { loadCustomers } from '../../store/actions/customers';
import ListCard from '../../components/ListCard';
import Loading from '../../components/Loading';

class Home extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    const { customers, loadCustomers: propsLoadCustomers } = this.props;

    if (customers.length === 0) {
      await propsLoadCustomers();
    }

    this.setState({ loading: false });
  }

  render() {
    const { customers } = this.props;
    const { loading } = this.state;

    return (
      <Container
        header={{
          icon: userIcon,
          component: 'h1',
          text: 'Painel de clientes',
        }}
        subHeader={{
          title: 'Listagem de usuários',
          description: 'Escolha um cliente para visualizar os detalhes',
          button: {
            text: 'Novo cliente',
            classes: 'btn--theme',
            link: '/clientes/novo',
          },
        }}
      >
        {!loading ? (
          <ListCard list={customers} />
        ) : (
          <Loading />
        )}
      </Container>
    );
  }
}

Home.propTypes = {
  customers: PropTypes.instanceOf(Object).isRequired,
  loadCustomers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  customers: state.customersReducer.customers,
});

export default connect(mapStateToProps, {
  loadCustomers,
})(Home);
