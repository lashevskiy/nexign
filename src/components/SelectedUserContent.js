/**
 * Created by lashevskiy on 22.08.2018.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';

import { List, Avatar, Button } from 'antd';

import DrawerForm from '../components/DrawerForm';

export default class SelectedUserContent extends Component {
    render(){
        let {selectedUser, deleteUser} = this.props;
        return (
            <div>
                {selectedUser ?
                <List
                    itemLayout="horizontal"
                    dataSource={[{}]}
                    renderItem={item => (
                        <List.Item actions={[
                            <DrawerForm games={(selectedUser && selectedUser.ownedGames) || []}/>,
                            <Button onClick={()=>window.location.href=selectedUser.info.profileurl}>Перейти в Steam профиль</Button>,
                            <Button type="danger" onClick={()=>deleteUser(selectedUser)}>Удалить из списка</Button>
                        ]}>
                            <List.Item.Meta
                                avatar={<Avatar src={selectedUser.info && selectedUser.info.avatarfull} />}
                                title={selectedUser.name}
                                description={
                                    <div>
                                        <p>Количество игр: {(selectedUser.ownedGames && selectedUser.ownedGames.length) || 0}</p>
                                        <p>Steam Id: {selectedUser.info && selectedUser.info.steamid}</p>
                                        <p>{selectedUser.info && selectedUser.info.profileurl}</p>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
                    :
                <div>Для отображения детальной информации необходимо добавить игрока. После чего выбрать необходимого из списка добавленных игроков.</div>
                }
            </div>
        )
    }
}


SelectedUserContent.propTypes = {
    deleteUser: PropTypes.func.isRequired
};
