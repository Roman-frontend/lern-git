export default function setStylesChat(theme) {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'column',
      height: '100vh',
      lineHeight: 'normal',
      background: '#dfe0f7',
    },
    workSpace: {
      minWidth: 550,
      maxWidth: 900,
      height: 600,
      background: theme.palette.primary.main,
    },
    header: { paddingLeft: 8 },
    conversation: {
      flexGrow: 1,
      p: '20px 0px 0px 0px',
      backgroundColor: theme.palette.primary.light,
    },
  };
}
