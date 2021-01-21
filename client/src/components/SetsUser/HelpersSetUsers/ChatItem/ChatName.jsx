import React from 'react';
import { Grid } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

export function createDirectMsgName(name) {
  return (
    <Grid container style={{ alignItems: 'center' }}>
      <Grid item xs={2}>
        <PersonIcon
          style={{ background: 'cadetblue', borderRadius: '0.4rem' }}
        />
      </Grid>
      <Grid item xs={10}>
        {name}
      </Grid>
    </Grid>
  );
}

export function createChannelName(isPrivate, name) {
  const nameChannel = isPrivate ? (
    <p className='main-font'>&#128274;{name}</p>
  ) : (
    <p className='main-font'>{`#${name}`}</p>
  );

  return (
    <Grid container className='left-bar__title-name'>
      <Grid item xs={12}>
        {nameChannel}
      </Grid>
    </Grid>
  );
}
