.post-content {
      padding: 0 0 15px;
      position: relative;
      z-index: 1;
      > * {
        position: relative;
        z-index: 10; // h2のpadding部分より前面に来るように
      }
      .table-of-contents {
        background: #f3f3f3;
        border: 1px solid #ccc;
        padding: 5px 10px;
        width: fit-content;
        ul {
          padding-left: 24px;
        }
        &:before {
          content: '目次';
          font-weight: bold;
          font-size: 16px;
        }
      }
    }