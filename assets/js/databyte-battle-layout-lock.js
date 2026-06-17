// assets/js/databyte-battle-layout-lock.js
(function () {
  const STYLE_ID = "databyteBattleLayoutLockStyles";

  function inject() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #dbBattlePhase2.dbp2{
        grid-template-rows:auto minmax(0,1fr) auto auto auto!important;
        align-content:stretch!important;
        min-height:100%!important;
        width:100%!important;
        box-sizing:border-box!important;
      }
      #dbBattlePhase2 .dbp2-arena{
        min-height:0!important;
        align-self:stretch!important;
      }
      #dbBattlePhase2 .dbp2-f{
        min-width:0!important;
        align-content:center!important;
        gap:4px!important;
      }
      #dbBattlePhase2 .dbp2-icon{
        flex:0 0 auto!important;
      }
      #dbBattlePhase2 .dbp2-name,
      #dbBattlePhase2 .dbp2-sub,
      #dbBattlePhase2 .dbp2-meter,
      #dbBattlePhase2 .dbp2-log,
      #dbBattlePhase2 button{
        box-sizing:border-box!important;
      }
      #dbBattlePhase2 .dbp2-actions button{
        min-height:56px!important;
      }
      #dbBattlePhase2 .dbp2-log{
        min-height:50px!important;
        max-height:60px!important;
      }
      @media(max-width:768px){
        #dbBattlePhase2.dbp2{
          padding:14px!important;
          gap:8px!important;
          grid-template-rows:auto auto auto minmax(52px,auto) auto!important;
          overflow:auto!important;
        }
        #dbBattlePhase2 .dbp2-top{
          min-height:22px!important;
          justify-content:space-between!important;
        }
        #dbBattlePhase2 .dbp2-arena{
          display:grid!important;
          grid-template-columns:1fr!important;
          gap:8px!important;
        }
        #dbBattlePhase2 .dbp2-icon{
          width:92px!important;
          height:92px!important;
          font-size:3.15rem!important;
        }
        #dbBattlePhase2 .dbp2-name{
          font-size:1.45rem!important;
          line-height:1.05!important;
        }
        #dbBattlePhase2 .dbp2-sub{
          font-size:.82rem!important;
          line-height:1.15!important;
        }
        #dbBattlePhase2 .dbp2-bar{
          width:min(100%,320px)!important;
          max-width:320px!important;
          height:8px!important;
        }
        #dbBattlePhase2 .dbp2-meters{
          display:grid!important;
          grid-template-columns:1fr!important;
          gap:7px!important;
          width:min(100%,460px)!important;
          justify-self:center!important;
        }
        #dbBattlePhase2 .dbp2-meter{
          width:100%!important;
          padding:8px 10px!important;
        }
        #dbBattlePhase2 .dbp2-log{
          width:min(100%,460px)!important;
          justify-self:center!important;
          min-height:54px!important;
          max-height:62px!important;
          overflow:auto!important;
        }
        #dbBattlePhase2 .dbp2-actions{
          width:min(100%,460px)!important;
          justify-self:center!important;
          display:grid!important;
          grid-template-columns:1fr!important;
          gap:8px!important;
        }
        #dbBattlePhase2 .dbp2-actions button{
          width:100%!important;
          min-height:56px!important;
          font-size:1rem!important;
          padding:12px 10px!important;
        }
        #dbBattlePhase2 .dbp2-party{
          grid-template-columns:1fr!important;
          width:min(100%,460px)!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();