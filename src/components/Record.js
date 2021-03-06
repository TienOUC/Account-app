import React from 'react';
import PropTypes from 'prop-types'
import * as RecordsAPI from '../utils/RecordsAPI'

export default class Records extends React.Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    recordRow() {
        return (
            <tr>
                <td>{this.props.record.date}</td>
                <td>{this.props.record.title}</td>
                <td>{this.props.record.amount}</td>
                <td>
                    <button className="btn btn-info mr-2" onClick={this.handleToggle.bind(this)}>Edit</button>
                    <button className="btn btn-danger " onClick={this.handleDelete.bind(this)}>Delete</button>
                </td>
            </tr>
        );
    }
    handleDelete(event) {
        event.preventDefault()
        RecordsAPI.remove(this.props.record.id).then(
            response => {
                this.props.handleDeleteRecord(this.props.record)
            }
        ).catch(
            error => error.message
        )
    }

    handleToggle() {
        this.setState({
            edit: !this.state.edit
        })
    }

    //Edit data
    handleEdit(event) {
        event.preventDefault()
        const record = {
            date: this.refs.date.value,
            title: this.refs.title.value,
            // amount : Number.parseInt(this.refs.amount.value, 0)
            amount: Number.parseFloat(this.refs.amount.value, 0).toFixed(2)
        }

        RecordsAPI.update(this.props.record.id, record).then(
            response => {
                this.setState({ edit: false })
                this.props.handleEditRecord(this.props.record, response.data)
            }
        ).catch(
            error => error.message
        )
    }

    recordForm() {
        return (
            <tr>
                <td><input type="text" className="form-control" defaultValue={this.props.record.date} ref="date"></input></td>
                <td><input type="text" className="form-control" defaultValue={this.props.record.title} ref="title" ></input></td>
                <td><input type="text" className="form-control" defaultValue={this.props.record.amount} ref="amount"></input></td>
                <td>
                    <button className="btn btn-info mr-1" onClick={this.handleEdit.bind(this)}>Update</button>
                    <button className="btn btn-danger " onClick={this.handleToggle.bind(this)}>Cancel</button>
                </td>
            </tr>
        );
    }

    render() {
        if (this.state.edit) {
            return this.recordForm()
        } else {
            return this.recordRow()
        }
    }
}

//数据类型检查
Records.propTypes = {
    id: PropTypes.string,
    date: PropTypes.string,
    title: PropTypes.string,
    amount: PropTypes.number
}