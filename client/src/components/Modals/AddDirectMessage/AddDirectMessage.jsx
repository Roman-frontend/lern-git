import React, { useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import {
  reactiveVarName,
  reactiveVarId,
} from '../../../GraphQLApp/reactiveVars';
import { GET_DIRECT_MESSAGES } from '../../SetsUser/SetsUserGraphQL/queryes';
import './add-people-to-channel.sass';

const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});

export const AddDirectMessage = withStyles(styles)((props) => {
  const { data: allUsers } = useQuery(GET_USERS);
  const { data: drMessages } = useQuery(GET_DIRECT_MESSAGES, {
    onCompleted(data) {
      //console.log(data);
    },
  });
  const {
    done,
    classes,
    modalAddDmIsOpen,
    setModalAddDmIsOpen,
    isErrorInPopap,
  } = props;
  const notInvitedRef = useRef();

  const closePopap = () => {
    setModalAddDmIsOpen(false);
  };

  useEffect(() => {
    if (allUsers && allUsers.users[0] && reactiveVarId()) {
      let allNotInvited = allUsers.users.filter(
        (user) => user.id !== reactiveVarId()
      );
      if (
        drMessages &&
        drMessages.directMessages &&
        drMessages.directMessages[0]
      ) {
        drMessages.directMessages.forEach((directMessage) => {
          directMessage.members.forEach((memberId) => {
            allNotInvited = allNotInvited.filter(
              (user) => user.id !== memberId
            );
          });
        });
      }
      notInvitedRef.current = allNotInvited;
      //notInvitedRef.current = allUsers.users;
    }
  }, [allUsers, drMessages, reactiveVarId()]);

  return (
    <>
      <Dialog
        open={modalAddDmIsOpen}
        onClose={() => setModalAddDmIsOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle
          id='form-dialog-title'
          classes={{ root: classes.titleRoot }}
        >
          Invite people to {reactiveVarName()}
        </DialogTitle>
        <SelectPeople
          closePopap={closePopap}
          notInvitedRef={notInvitedRef}
          done={done}
          isErrorInPopap={isErrorInPopap}
        />
      </Dialog>
    </>
  );
});
