import React, { useState } from 'react';
import { Form, InputNumber, Button, Typography, Tooltip, Card } from 'antd';
import { DollarOutlined, PercentageOutlined, CalendarOutlined, CalculatorOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import 'antd/dist/reset.css'; // Ant Design styles reset

const { Title } = Typography;

const RetirementCalculator = () => {
  const [totalAmount, setTotalAmount] = useState(null);

  const onFinish = (values) => {
    const { monthlyExpenses, inflationRate, years } = values;

    let totalAmountNeeded = 0;
    let annualExpenses = monthlyExpenses * 12;

    // Loop to calculate the total amount considering inflation over the years
    for (let i = 0; i < years; i++) {
      totalAmountNeeded += annualExpenses;
      annualExpenses *= (1 + inflationRate / 100);
    }

    setTotalAmount(totalAmountNeeded.toFixed(2));
  };

  return (
    <Card
      title={<Title level={2} style={{ textAlign: 'center' }}>Retirement Calculator for Indonesia</Title>}
      style={{ margin: 'auto', marginTop: '20px', padding: '20px', maxWidth: '600px' }}
    >
      <Form
        name="retirement_calculator"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label={
            <span>
              Monthly Expenses <Tooltip title="Your estimated monthly expenses after retirement"><DollarOutlined /></Tooltip>
            </span>
          }
          name="monthlyExpenses"
          rules={[{ required: true, message: 'Please input your monthly expenses!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={100000}
            placeholder="e.g., 10,000,000"
            formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={(value) => value.replace(/,/g, '')}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Annual Inflation Rate (%) <Tooltip title="Estimated annual inflation rate"><PercentageOutlined /></Tooltip>
            </span>
          }
          name="inflationRate"
          rules={[{ required: true, message: 'Please input the inflation rate!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g., 3.5"
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Number of Years <Tooltip title="Number of years you expect to live after retirement"><CalendarOutlined /></Tooltip>
            </span>
          }
          name="years"
          rules={[{ required: true, message: 'Please input the number of years!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} placeholder="e.g., 20" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block icon={<CalculatorOutlined />}>
            Calculate
          </Button>
        </Form.Item>
      </Form>

      {totalAmount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          <Title level={4}>
            Total Amount Needed: IDR {new Intl.NumberFormat('id-ID').format(totalAmount)}
          </Title>
        </motion.div>
      )}
    </Card>
  );
};

export default RetirementCalculator;
