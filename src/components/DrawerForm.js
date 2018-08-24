import React from 'react';
import PropTypes from 'prop-types';
import {Drawer, Form, Button } from 'antd';
import { List } from 'antd';

class DrawerForm extends React.Component {
    state = { visible: false };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showDrawer}>
                    Все игры пользователя
                </Button>
                <Drawer
                    title={"Список игр ("+this.props.games.length+")"}
                    width={500}
                    closable={true}
                    placement="right"
                    onClose={this.onClose}
                    maskClosable={false}
                    visible={this.state.visible}
                    style={{
                        height: 'calc(100% - 55px)',
                        overflow: 'auto',
                        paddingBottom: 53,
                    }}
                >
                    {this.props.games.length > 0 ?
                            <List
                                dataSource={this.props.games}
                                renderItem={item => (<List.Item>{item.name}</List.Item>)}
                            />
                        : <p>Нет доступных игр.</p>
                    }
                </Drawer>
            </div>
        );
    }
}

const DrawerFormContainer = Form.create()(DrawerForm);

export default DrawerFormContainer;


DrawerForm.propTypes = {
    games: PropTypes.array.isRequired
};

DrawerForm.defaultProps = {
    games: []
};