import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Typography, Tooltip, Select, Row, Col, Card, Alert, Spin, Tabs } from 'antd';
import { DollarOutlined, CalculatorOutlined, BankOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import 'antd/dist/reset.css'; // Ant Design styles reset
import './App.css'; // Custom styles

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const InvestmentCalculator = () => {
  const [results, setResults] = useState([]);
  const [capitalFixedIncomeRate, setCapitalFixedIncomeRate] = useState(7.00); // Default rate if API fails
  const [sucorinvestMonthlyIncomeRate, setSucorinvestMonthlyIncomeRate] = useState(7.50); // Default rate if API fails
  const [avristPrimeIncomeRate, setAvristPrimeIncomeRate] = useState(7.75); // Default rate if API fails
  const [insightMoneyRate, setInsightMoneyRate] = useState(7.00); // Default rate if API fails
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundRates = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/scrape-fund-rate');
        if (response.data) {
          setCapitalFixedIncomeRate(response.data.capitalFixedIncomeRate || 7.00); // Fallback to default rate
          setSucorinvestMonthlyIncomeRate(response.data.sucorinvestMonthlyIncomeRate || 7.50); // Fallback to default rate
          setAvristPrimeIncomeRate(response.data.avristPrimeIncomeRate || 7.75); // Fallback to default rate
          setInsightMoneyRate(response.data.insightMoneyRate || 7.00); // Fallback to default rate
        }
      } catch (error) {
        console.error('Error fetching fund rates:', error);
        setError('Failed to fetch fund rates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFundRates();
  }, []);

  const fundRates = {
    capitalFixedIncome: capitalFixedIncomeRate,
    sucorinvestMonthlyIncome: sucorinvestMonthlyIncomeRate,
    avristPrimeIncome: avristPrimeIncomeRate,
    insightMoney: insightMoneyRate,
  };

  const calculateReturns = (investment, rate, period) => {
    const periodDays = {
      '1d': 1,
      '7d': 7,
      '1m': 30,
      '3m': 90,
      '6m': 180,
      '1y': 365,
    }[period];

    if (!periodDays) {
      return 0;
    }

    const annualRate = rate / 100;
    return investment * Math.pow(1 + annualRate, periodDays / 365);
  };

  const onFinish = (values) => {
    const { investment, period } = values;
    const results = Object.entries(fundRates).map(([fund, rate]) => {
      const finalAmount = calculateReturns(investment, rate, period);
      const percentageIncrease = ((finalAmount - investment) / investment) * 100;
      return {
        fund,
        finalAmount: finalAmount.toFixed(2),
        percentageGrowth: percentageIncrease.toFixed(2),
      };
    });

    // Find the highest percentage growth
    const maxGrowth = Math.max(...results.map(result => parseFloat(result.percentageGrowth)));
    setResults(results.map(result => ({
      ...result,
      isMax: parseFloat(result.percentageGrowth) === maxGrowth,
    })));
  };

  const moneyMarketFunds = [
    {
      fund: 'insightMoney',
      rate: insightMoneyRate,
      logo: 'https://cache.makmur.id/images/managers/637ee25579f48d91c48ef049/logo.png', // Replace with the correct logo URL
      name: 'Insight Money Fund',
    }
  ];

  const fixedIncomeFunds = [
    {
      fund: 'capitalFixedIncome',
      rate: capitalFixedIncomeRate,
      logo: 'https://cache.makmur.id/images/managers/60dee33a83d25903cd37fe5c/logo.png',
      name: 'Capital Fixed Income Fund',
    },
    {
      fund: 'sucorinvestMonthlyIncome',
      rate: sucorinvestMonthlyIncomeRate,
      logo: 'https://cache.makmur.id/images/managers/622ac483bf54c80a4005d956/logo.png',
      name: 'Sucorinvest Monthly Income Fund',
    },
    {
      fund: 'avristPrimeIncome',
      rate: avristPrimeIncomeRate,
      logo: 'https://cache.makmur.id/images/managers/60d1a3d94cc7bb3913edb053/logo.png',
      name: 'Avrist Prime Income Fund',
    }
  ];

  return (
    <div className="investment-container" style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>
      <Card
        className="investment-card"
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BankOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
            <Title level={2} style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Investment Calculator</Title>
          </div>
        }
        style={{ borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', background: '#fff' }}
      >
        {loading && <Spin size="large" style={{ display: 'block', margin: 'auto' }} />}
        {error && !loading && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
        {!loading && (
          <>
            <Form name="investment_calculator" onFinish={onFinish} layout="vertical" autoComplete="off">
              <Row gutter={24}>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    label={
                      <span>
                        Investment Amount <Tooltip title="Amount you want to invest"><DollarOutlined /></Tooltip>
                      </span>
                    }
                    name="investment"
                    rules={[{ required: true, message: 'Please input your investment amount!' }]}
                  >
                    <InputNumber
                      className="rounded-input"
                      style={{ width: '100%' }}
                      min={0}
                      step={100000}
                      placeholder="e.g., 1,000,000"
                      formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                      parser={(value) => value.replace(/,/g, '')}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    label="Choose Period"
                    name="period"
                    rules={[{ required: true, message: 'Please select the investment period!' }]}
                  >
                    <Select className="rounded-select" placeholder="Select period" style={{ width: '100%' }}>
                      <Option value="1d">1 Day</Option>
                      <Option value="7d">7 Days</Option>
                      <Option value="1m">1 Month</Option>
                      <Option value="3m">3 Months</Option>
                      <Option value="6m">6 Months</Option>
                      <Option value="1y">1 Year</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block icon={<CalculatorOutlined />} className="submit-button">
                      Calculate
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginTop: '30px' }}
              >
                <Tabs defaultActiveKey="money-market" style={{ borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', background: '#f9f9f9' }}>
                  <TabPane tab="Money Market" key="money-market">
                    <Card
                      title="Money Market Results"
                      style={{ borderRadius: '12px', background: '#fff' }}
                    >
                      {moneyMarketFunds.map((fund) => (
                        <Card
                          key={fund.fund}
                          style={{
                            marginBottom: '20px',
                            borderRadius: '12px',
                            border: 'none',
                            padding: '16px',
                            background: results.find(result => result.fund === fund.fund)?.isMax ? '#d0f0c0' : '#f5f5f5', // Highlight the max growth result
                            transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition for hover effect
                          }}
                          bordered={false}
                          hoverable // Add hover effect
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              alt={`${fund.name} Logo`}
                              src={fund.logo}
                              width="60"
                              height="60"
                              style={{ marginRight: '12px' }}
                            />
                            <Title level={4} style={{ marginBottom: '8px', fontSize: '20px', fontWeight: 'bold' }}>
                              {fund.name}
                            </Title>
                          </div>
                          <Text strong style={{ fontSize: '18px', display: 'block' }}>
                            Final Amount: IDR {new Intl.NumberFormat('id-ID').format(results.find(result => result.fund === fund.fund)?.finalAmount)}
                          </Text>
                          <Text style={{ fontSize: '16px', color: results.find(result => result.fund === fund.fund)?.isMax ? '#32a852' : '#4caf50', display: 'block' }}>
                            Percentage Growth: {results.find(result => result.fund === fund.fund)?.percentageGrowth}%
                          </Text>
                        </Card>
                      ))}
                    </Card>
                  </TabPane>
                  <TabPane tab="Fixed Income" key="fixed-income">
                    <Card
                      title="Fixed Income Results"
                      style={{ borderRadius: '12px', background: '#fff' }}
                    >
                      {fixedIncomeFunds.map((fund) => (
                        <Card
                          key={fund.fund}
                          style={{
                            marginBottom: '20px',
                            borderRadius: '12px',
                            border: 'none',
                            padding: '16px',
                            background: results.find(result => result.fund === fund.fund)?.isMax ? '#d0f0c0' : '#f5f5f5', // Highlight the max growth result
                            transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition for hover effect
                          }}
                          bordered={false}
                          hoverable // Add hover effect
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              alt={`${fund.name} Logo`}
                              src={fund.logo}
                              width="60"
                              height="60"
                              style={{ marginRight: '12px' }}
                            />
                            <Title level={4} style={{ marginBottom: '8px', fontSize: '20px', fontWeight: 'bold' }}>
                              {fund.name}
                            </Title>
                          </div>
                          <Text strong style={{ fontSize: '18px', display: 'block' }}>
                            Final Amount: IDR {new Intl.NumberFormat('id-ID').format(results.find(result => result.fund === fund.fund)?.finalAmount)}
                          </Text>
                          <Text style={{ fontSize: '16px', color: results.find(result => result.fund === fund.fund)?.isMax ? '#32a852' : '#4caf50', display: 'block' }}>
                            Percentage Growth: {results.find(result => result.fund === fund.fund)?.percentageGrowth}%
                          </Text>
                        </Card>
                      ))}
                    </Card>
                  </TabPane>
                </Tabs>
              </motion.div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default InvestmentCalculator;
