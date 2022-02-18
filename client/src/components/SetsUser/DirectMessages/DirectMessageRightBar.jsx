import React, { useMemo } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import { wsSend } from '../../../WebSocket/soket';
import {
  GET_DIRECT_MESSAGES,
  REMOVE_DIRECT_MESSAGE,
} from '../SetsUserGraphQL/queryes';
import {
  activeChatId,
  reactiveVarId,
  reactiveDirectMessages,
} from '../../../GraphQLApp/reactiveVars';
import { determineActiveChat } from '../../Helpers/determineActiveChat';
import { useSnackbar } from 'notistack';

const DirectMessageRightBar = (props) => {
  const navigate = useNavigate();
  const { data: auth } = useQuery(AUTH);
  const { data: users } = useQuery(GET_USERS);
  const { data: dDm } = useQuery(GET_DIRECT_MESSAGES);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const userId = useReactiveVar(reactiveVarId);
  const { enqueueSnackbar } = useSnackbar();

  const activeDirectMessage = useMemo(() => {
    if (activeDirectMessageId && dDm?.directMessages?.length) {
      return dDm.directMessages.find(
        (drMsg) => drMsg !== null && drMsg.id === activeDirectMessageId
      );
    }
  }, [activeDirectMessageId, dDm]);

  const name = useMemo(() => {
    if (activeDirectMessage) {
      return determineActiveChat(activeDirectMessage, users.users, auth.id);
    }
    return '#generall';
  }, [activeDirectMessage]);

  const [removeDirectMessage] = useMutation(REMOVE_DIRECT_MESSAGE, {
    update: (cache, { data: { directMessages } }) => {
      cache.modify({
        fields: {
          directMessages(existingDirectMessagesRefs, { readField }) {
            return existingDirectMessagesRefs.filter(
              (directMessageRef) =>
                directMessages.remove.recordId !==
                readField('id', directMessageRef)
            );
          },
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onCompleted(data) {
      const removedDm = data.directMessages.remove.record;
      const removedUserId = removedDm.members.find((id) => id !== userId);
      const storage = JSON.parse(sessionStorage.getItem('storageData'));
      const newDrMsgIds = storage.directMessages.filter(
        (dmId) => dmId !== removedDm.id
      );
      const toStorage = JSON.stringify({
        ...storage,
        directMessages: newDrMsgIds,
      });
      enqueueSnackbar('Direct Message is a success removed!', {
        variant: 'success',
      });
      activeChatId({});
      sessionStorage.setItem('storageData', toStorage);
      reactiveDirectMessages(newDrMsgIds);
      wsSend({ meta: 'removedDm', userId, dmId: removedDm.id, removedUserId });
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
      enqueueSnackbar('Direct Message isn`t removed!', { variant: 'error' });
    },
  });

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <PersonIcon
            style={{
              background: 'cadetblue',
              borderRadius: '50%',
              fontSize: 40,
              cursor: 'pointer',
            }}
          />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
      <ListItem
        button
        onClick={() =>
          removeDirectMessage({ variables: { id: activeDirectMessageId } })
        }
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary='Remove chat' />
      </ListItem>
      <ListItem button onClick={() => navigate(`/room/${v4()}`)}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary='Call' />
      </ListItem>
    </List>
  );
};

export default React.memo(DirectMessageRightBar);
