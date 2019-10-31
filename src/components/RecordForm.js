import React from 'react';
import * as RecordsAPI from '../utils/RecordsAPI'
import 'bootstrap/dist/css/bootstrap.css'

export default class RecordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            title: "",
            amount: ""
        }
    }

    handleChange(event) {
        let name, obj;
        name = event.target.name;
        this.setState((
            obj = {},
            obj["" + name] = event.target.value,
            obj
        ))
    }

    valid() {
        return this.state.date && this.state.title && this.state.amount
    }

    handleSubmit(event) {
        event.preventDefault();

        const data = {
            date: this.state.date,
            title: this.state.title,
            amount: Number.parseInt(this.state.amount, 0)
        }

        RecordsAPI.create(data).then(
            response => {
                this.props.handleNewRecord(response.data);
                this.setState(
                    {
                        date: "",
                        title: "",
                        amount: ""
                    }
                )

            }
        ).catch(
            error => console.log(error.message)
        )
    }

    render() {
        return (
            <form className = 'form-inline mb-3' onSubmit = { this.handleSubmit.bind(this) }>
                <div className = "form-group mr-1">
                    <input type = "text" className = "form-control" onChange = { this.handleChange.bind(this) } placeholder = "Date" name = "date" value = { this.state.date }></input>
                </div>
                <div className = "form-group mr-1">
                    <input type = "text" className = "form-control" onChange = { this.handleChange.bind(this) } placeholder = "Title" name = "title" value = { this.state.title} ></input>
                </div>
                <div className = "form-group mr-1">
                    <input type = "text" className = "form-control" onChange = { this.handleChange.bind(this) } placeholder = "Amount" name = "amount" value = { this.state.amount }></input>
                </div>
                <button type = "submit" className = "btn btn-primary" disabled = { !this.valid() }>Create Record</button>
            </form>
        );
    }
}

