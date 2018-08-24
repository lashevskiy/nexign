
import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import PropTypes from "prop-types";
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
    componentDidMount() {
        this.props.form.validateFields();
    }

    state = {
        user: '',
        errorMessage: ''
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                /*console.log('Received values of form: ', values);*/
            }
        });
    }

    handleFilterChange(e){
        this.setState({user: e.target.value});
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName');

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Необходимо заполнить' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" onChange={this.handleFilterChange.bind(this)}/>
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                        loading={this.props.isShowSpin}
                        onClick={()=>{
                            this.props.findAndAddUser(this.state.user)
                        }}
                    >
                        Найти и добавить игрока
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

export default WrappedHorizontalLoginForm;



HorizontalLoginForm.propTypes = {
    users: PropTypes.array.isRequired,
    isShowSpin: PropTypes.bool.isRequired
};

HorizontalLoginForm.defaultProps = {
    users: [],
    isShowSpin: false
};