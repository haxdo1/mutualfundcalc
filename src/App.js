import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import InvestmentCalculator from './InvestmentCalculator';
import RetirementCalculator from './RetirementCalculator';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        {/* Header with navigation */}
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">Investment Calculator</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/retirement">Retirement Calculator</Link>
            </Menu.Item>
          </Menu>
        </Header>

        {/* Main content with padding */}
        <Content style={{ padding: '0 50px', marginTop: '64px' }}>
          <div style={{ padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<InvestmentCalculator />} />
              <Route path="/retirement" element={<RetirementCalculator />} />
            </Routes>
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          ©2024 Investment Calculators
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
