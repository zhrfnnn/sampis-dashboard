import React, { useState, useEffect } from "react";

import { Stack, Typography, Menu, MenuItem } from "@mui/material";
import UI from "@gh/ui";
import IconBtn from "@component/app/bookmark/iconBtn";
import Form from "../_newBookmark/_form";
import ContextMenu from "../_contextMenu";
import FolderIcon from '@mui/icons-material/FolderRounded';

export default function App({ data, search }) {
  const [contextMenu, setContextMenu] = React.useState(null);

  useState(() => {
    data && console.log(data);
  }, [data]);

  function fnSearch(e) {
    if (!search) return e.isShow;
    if (search == "*") return true;
    if (e.isFolder && !e.desc) return true;
    return Object.keys(e).some((k) => typeof e[k] === "string" && e[k].toLowerCase().includes(search.toLowerCase()));
  }

  const handleContextMenu = (event, d) => {
    event.preventDefault();
    setContextMenu({
      data: d,
      pos:
        contextMenu === null
          ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
          : null,
    });
  };

  const handleClose = () => setContextMenu(null);

  return (
    <UI.Col>
      <UI.Grid container spacing={2}>
        {data
          ?.filter(fnSearch)
          .sort((a, b) => (a.path > b.path ? -1 : 1))
          .map((d, ix) => (
            <UI.Grid item xs={12} sm={6} md={3} xl={2} key={ix}>
              {d.isFolder ? (<RenderMultiple d={d} ix={ix} handleContextMenu={handleContextMenu} />) : (<RenderSingle d={d} ix={ix} handleContextMenu={handleContextMenu} />)}
            </UI.Grid>
          ))}
        <ContextMenu contextMenu={contextMenu} onClose={handleClose} />
      </UI.Grid>
    </UI.Col>
  );
}

function getDomain(url) {
  if (!url) return "";
  let domain = new URL(url);
  return domain?.hostname;
}

function RenderSingle({ d, ix, handleContextMenu }) {
  return (
    <UI.Row
      onContextMenu={(e) => handleContextMenu(e, d)}
      key={ix}
      component="a"
      href={d.path}
      alignItems="center"
      spacing={2}
      sx={{
        minWidth: 220,
        width: "100%",
        flexShrink: 0,
        flexGrow: 1,

        border: "1px solid grey",
        borderRadius: 2,
        p: 0.5,
        "&:hover": {
          borderColor: "primary.main",

          "& .BM-Title": {
            color: "primary.main",
          },
        },
      }}
    >
      {d.isNotIcon ? (
        <NoIcon />
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?domain=${d.path}&sz=128`}
          alt=""
          style={{
            width: 32,
            height: "auto",
          }}
        />
      )}

      <UI.Col>
        <UI.Elipsis bold variant="body2" color={"white"} className="BM-Title">
          {d.name}
        </UI.Elipsis>
        <UI.Elipsis variant="caption" color={"grey"} mt={"-4px"}>
          {d.desc || getDomain(d.path)}
        </UI.Elipsis>
      </UI.Col>
    </UI.Row>
  );
}
function RenderMultiple({ d, ix, handleContextMenu }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    d.bookmarks.length && setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <UI.Row
        // onContextMenu={(e) => handleContextMenu(e, d)}
        key={ix}
        component="a"
        alignItems="center"
        spacing={2}
        onClick={handleClick}
        sx={{
          minWidth: 220,
          width: "100%",
          flexShrink: 0,
          flexGrow: 1,

          border: "1px solid grey",
          borderRadius: 2,
          p: 0.5,
          "&:hover": {
            borderColor: "primary.main",

            "& .BM-Title": {
              color: "primary.main",
            },
          },
        }}
      >
        <FolderIcon style={{ width: 32, height: "auto", color: "white" }} />
        <UI.Col>
          <UI.Elipsis bold variant="body2" color={"white"} className="BM-Title">
            {d.name}
          </UI.Elipsis>
          {!d.isFolder &&
            <UI.Elipsis variant="caption" color={"grey"} mt={"-4px"}>
              {d.desc && d.desc}
            </UI.Elipsis>
          }
        </UI.Col>
      </UI.Row>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#191d26",
              minWidth: 220,
              flexShrink: 0,
              flexGrow: 1,
            }
          }
        }}
        MenuListProps={{ sx: { width: anchorEl && anchorEl.offsetWidth, py: 0 } }}
        sx={{
          p: 0,
        }}>
        {d.bookmarks.map((db, ii, arr) => (
          <MenuItem sx={{ px: 0, pt: 0, pb: arr.length - 1 != ii && 2, '&:hover': { backgroundColor: "#191d26", } }}>
            <RenderSingle d={db} ix={ii} handleContextMenu={handleContextMenu} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function NoIcon(params) {
  return (
    <UI.Col center width={32}>
      <UI.Col
        sx={{
          width: 12,
          height: 12,
          bgcolor: "primary.main",
          borderRadius: "50%",
        }}
      ></UI.Col>
    </UI.Col>
  );
}
