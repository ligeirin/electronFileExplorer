import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBorderAll,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import fileTypeIcons from './icons';

function Hello() {
  const [path, setPath] = useState('C:/Users/Diogo Alves/Desktop/');
  const [files, setFiles] = useState([]);
  const [filesList, setFilesList] = useState([] as any[]);
  const [filesGrid, setFilesGrid] = useState([] as any[]);
  const [listView, setListView] = useState(true);

  useEffect(() => {
    getFiles();
  }, [path]);

  const handleFileClick = (
    event: any,
    fileName: string,
    fileType: string,
    filePath: string,
  ) => {
    if (event.detail == 2 && fileType === '') {
      setPath((prevPath) => prevPath + fileName + '/');
    }
  };

  function getFiles() {
    window.electron.ipcRenderer.once('read-folder', (arg) => {
      if ((arg as any[]).length == 1 && (arg as any[])[0] == 'blocked') {
        goUpOne();
        alert('Folder is blocked');
        return;
      }

      setFiles(arg as never[]);

      setFilesList(
        (arg as any[]).map((f) => {
          return (
            <FileListItem
              key={f.name}
              stats={f}
              handleClick={handleFileClick}
            />
          );
        }) as any,
      );

      setFilesGrid(
        (arg as any[]).map((f) => {
          return (
            <FileGridItem
              key={f.name}
              stats={f}
              handleClick={handleFileClick}
            />
          );
        }) as any,
      );
    });

    window.electron.ipcRenderer.sendMessage('read-folder', [path]);
  }

  function goUpOne() {
    const newPath = path.split('/');
    const folder = newPath.pop();
    console.log(newPath, newPath.pop());
    setPath(newPath.join('/') + '/');
  }

  return (
    <div className="explorer-window">
      <header className="explorer-header">
        <button onClick={() => goUpOne()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <input type="text" value={path} readOnly />
        <button onClick={() => setListView(!listView)}>
          <FontAwesomeIcon icon={listView ? faList : faBorderAll} />
        </button>
      </header>

      <section
        className={'explorer ' + (listView ? 'explorer-list' : 'explorer-grid')}
      >
        {listView ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>File</th>
                <th>Created</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>{filesList}</tbody>
          </table>
        ) : (
          filesGrid
        )}
      </section>
    </div>
  );
}

function formatSize(size: number) {
  if (size == 0) return '';

  return size < 1024
    ? size + ' B'
    : size < 1048576
    ? (size / 1024).toFixed(2) + ' KB'
    : size < 1073741824
    ? (size / 1048576).toFixed(2) + ' MB'
    : (size / 1073741824).toFixed(2) + ' GB';
}

function FileListItem({
  stats,
  handleClick,
}: {
  stats: any;
  handleClick: any;
}) {
  return (
    <tr
      className="file"
      onClick={(ev) => handleClick(ev, stats.name, stats.type, stats.path)}
      data-tooltip-content={stats.name}
      data-tooltip-id={`tooltip${stats.name}`}
      data-tooltip-place="bottom"
      data-tooltip-variant="dark"
      data-tooltip-delay-show={500}
    >
      <td>
        <FontAwesomeIcon
          className="file-icon"
          icon={fileTypeIcons(stats.type)}
        />
      </td>

      <td>{stats.name}</td>
      <td>{(stats.birthtime as Date).toDateString()}</td>
      <td style={{textAlign: "right"}}>{formatSize(stats.size)}</td>
      <td>
        <Tooltip id={`tooltip${stats.name}`} />
      </td>
    </tr>
  );
}

function FileGridItem({
  stats,
  handleClick,
}: {
  stats: any;
  handleClick: any;
}) {
  return (
    <div
      className="file"
      onClick={(ev) => handleClick(ev, stats.name, stats.type, stats.path)}
    >
      <FontAwesomeIcon className="file-icon" icon={fileTypeIcons(stats.type)} />

      <span
        className="file-name"
        data-tooltip-content={stats.name}
        data-tooltip-id={`tooltip${stats.name}`}
        data-tooltip-place="bottom"
        data-tooltip-variant="dark"
        data-tooltip-delay-show={500}
      >
        {stats.name}
      </span>
      <Tooltip id={`tooltip${stats.name}`} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
