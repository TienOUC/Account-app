import React from 'react';
import Record from './Record'
//import { getJSON } from 'jquery'  //按需导入，只需要getJSON
// import axios from 'axios'
import * as RecordsAPI from '../utils/RecordsAPI'
import RecordForm from './RecordForm'
import AmountBox from './AmountBox'
import 'bootstrap/dist/css/bootstrap.css'

class Records extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      records: []
    }
  }

  // componentDidMount() {
  //   getJSON("https://5db85da7177b350014ac796d.mockapi.io/api/v1/records").then(
  //     response => this.setState({
  //       records: response,
  //       isLoaded: true
  //     }),
  //     error => this.setState({
  //       isLoaded: true,
  //       error: error
  //     })
  //   )
  // }

  //axios请求API
  componentDidMount() {
    RecordsAPI.getALl().then(
      response => this.setState({
        records: response.data,
        isLoaded: true
      })
    ).catch(
      error => this.setState({
        isLoaded: true,
        error: error
      })
    )
  }
  //add new Record
  addRecord(record) {
    this.setState({
      error: null,
      isLoaded: true,
      records: [
        ...this.state.records,
        record
      ]
    })
  }

  //update Record
  updateRecord(record, data) {
    const recordIndex = this.state.records.indexOf(record)
    const newRecords = this.state.records.map((item, index) => {
      if (index !== recordIndex) {
        return item
      }
      return {
        ...item,
        ...data
      }
    })
    this.setState({
      records: newRecords
    })
  }
  //delete Record
  deleteRecord(record) {
    const recordIndex = this.state.records.indexOf(record)
    const newRecords = this.state.records.filter((item, index) => index !== recordIndex)
    this.setState({
      records: newRecords
    })
  }

  credits() {
    let credits = this.state.records.filter((record) => {
      return record.amount >= 0
    })
    return credits.reduce((prev, curr) => {
      // return prev + Number.parseInt(curr.amount, 0)
      return (prev + Number.parseFloat(curr.amount, 0)).toFixed(2)
    }, 0)
  }

  debit() {
    let credits = this.state.records.filter((record) => {
      return record.amount < 0
    })
    return credits.reduce((prev, curr) => {
      // return prev + Number.parseInt(curr.amount, 0)
      return prev + Number.parseFloat(curr.amount, 0)
    }, 0)
  }

  balance() {
    return this.credits()*1 + this.debit()*1
  }


  render() {
    const { error, isLoaded, records } = this.state;
    let recordsComponent;

    if (error) {
      recordsComponent = <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      recordsComponent = <div>Loading...</div>;
    } else {
      recordsComponent = (
        <table className="table table-bordered" >
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (<Record
              key={record.id}
              record={record}
              handleEditRecord={this.updateRecord.bind(this)}
              handleDeleteRecord={this.deleteRecord.bind(this)}
            />)
            )}
          </tbody>
        </table>
      );
    }
    return (
      <div>
        <h2>Records</h2>
        <div className="row mb-3">
          <AmountBox text="Credits" type="success" amount={this.credits()} />
          <AmountBox text="Debit" type="danger" amount={this.debit()} />
          <AmountBox text="Balance" type="info" amount={this.balance()} />
        </div>
        <RecordForm handleNewRecord={this.addRecord.bind(this)} />
        {recordsComponent}
      </div>
    )
  }
}

export default Records;
