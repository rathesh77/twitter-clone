import React from "react"

const WRITE_IDLE_TIMEOUT = 3000
class UsersWriting extends React.Component {

    constructor(props) {
        super(props)
        const { selectedChatId, socket } = props
        this.state = {
            usersWriting: [],
            selectedChatId,
            socket,
            clearUsersWritingHOF: {}

        }

        this.clearUsersWriting = (usersWriting, userId) => {
            return () => {
                const _usersWriting = { ...usersWriting }
                delete _usersWriting[userId]
                this.setState({
                    usersWriting: _usersWriting
                })
            }
        }
        this.clearUsersWriting = this.clearUsersWriting.bind(this)
    }

    componentDidMount() {
        this.state.socket.on('user_writing', ({ user, chatId }) => {
            const { selectedChatId, usersWriting, clearUsersWritingHOF } = this.state
            if (chatId == selectedChatId) {
                if (usersWriting[user.uid] == null) {
                    const _usersWriting = { ...usersWriting }
                    _usersWriting[user.uid] = user
                    const _clearUsersWritingHOF = { ...clearUsersWritingHOF }
                    _clearUsersWritingHOF[user.uid] = setTimeout(this.clearUsersWriting(usersWriting, user.uid), WRITE_IDLE_TIMEOUT)
                    this.setState({
                        clearUsersWritingHOF: _clearUsersWritingHOF,
                        usersWriting: _usersWriting
                    })
                } else {
                    clearTimeout(clearUsersWritingHOF[user.uid])
                    const _clearUsersWritingHOF = { ...clearUsersWritingHOF }
                    _clearUsersWritingHOF[user.uid] = setTimeout(this.clearUsersWriting(usersWriting, user.uid), WRITE_IDLE_TIMEOUT)
                    this.setState({ clearUsersWritingHOF: _clearUsersWritingHOF })
                }
            }
            return usersWriting
        })
    }

    render() {
        const { usersWriting } = this.state
        return (
            <div style={{'position': 'relative', bottom: '140px', 'left': '20px'}}>
                {Object.keys(usersWriting).length > 0 ?
                    Object.keys(usersWriting).length > 1 ?
                        "Plusieurs personnes ecrivent..." :
                        usersWriting[Object.keys(usersWriting)[0]].username + ' ecrit...' :
                    null}
            </div>
        )
    }
}

export default UsersWriting;