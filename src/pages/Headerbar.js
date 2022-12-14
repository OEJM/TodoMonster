import { React, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "react-modal";
import "../css/Headerbar.css";

const deleteUserStyles = {
  content: {
    width: "70%",
    marginTop: "90%",
    marginLeft: "8%",
  },
  overlay: {
    zIndex: 4,
  },
};

function Sidebar(user_id) {
  const navigate = useNavigate();
  //유저정보
  const userId = user_id.user_id;
  const userName = user_id.user_name;
  const userEamil = user_id.user_email;
  const userImg = user_id.user_img;
  //모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followingList, setFollowingList] = useState('');
  const [followerList, setFollowerList] = useState('');

  // 할 일 카테고리 DB에서 가져오기
  const todoCateList = useFetch('/todolist/todoCate');
  function useFetch(url) {
    const [data, setData] = useState([]);

    async function fetchUrl() {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    }

    useEffect(() => {
      fetchUrl();
    }, []);
    return data;
  }

  // 카테고리 나타내기
  function CateItem({ cate_name }) {
    return (
      <span>
        {cate_name}
      </span>
    )
  }

  function openModal() {
    setIsModalOpen(true);
  }

  const closeModal = (e) => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const data = {
      userId: userId
    }
    axios.post("/follow/followCount", data).then((res) => {
      setFollowerList(res.data.followerList[0].follower);
      setFollowingList(res.data.followingList[0].following);
    });
  }, [userId]);

  // console.log(followingList);

  //로그아웃
  const logoutForm = (e) => {
    e.preventDefault();

    axios
      .get("/user/logout")
      .then(function (res) {
        console.log(res);
        if (res.data.success) {
          navigate("/home");
        }
      })
      .catch(function (error) {
        alert("로그아웃 에러: " + error);
      });
  };


  //계정 삭제
  const DeleteUserForm = useCallback((e) => {
    e.preventDefault();

    const data = {
      userId: e.target.userId.value,
    };

    axios
      .post("/user/deleteUser", data)
      .then(function (response) {
        if (response.data.success) {
          navigate("/home");
        }
      })
      .catch(function (error) {
        alert("계정 삭제 에러: " + error);
      });
  }, []);

  return (
    <div className="headerContent">
      <SearchIcon
        className="searchIcon"
        onClick={() => {
          navigate("/search", {
            state: {
              userId:userId
            }
          });
        }}
      />
      <input id="check-btn" type="checkbox" />
      <label id="check-label" htmlFor="check-btn">
        <MenuIcon className="menuIcon" />
      </label>

      <div className="sidebar">
        <div
          id="sidebarUserInfoDiv"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <div className="userInfoLeftDiv">
          {userImg === null ? 
            <img className='sidebarProfileImg' src={require('../img/profile1.jpeg')}/> :
             userImg === '' ? 
              <img className='sidebarProfileImg' src={require('../img/profile1.jpeg')}/> : <img className='sidebarProfileImg' src={userImg}/>}
          </div>
          <div className="userInfoRightDiv">
            <div id="sidebarName">{userName}</div>
            <div id="sidebarEmail">{userEamil}</div>
          </div>
        </div>

        <div
          className="sidebarFollowDiv"
          onClick={() => {
            navigate("/followList", {
              state : {
                userId : userId,
                followerList : followerList,
                followingList : followingList,
              }
            });
          }}
        >
          <span>{followerList} 팔로워 </span>
          <span>{followingList} 팔로잉 </span>
        </div>
        <hr />

        <div
          className="sidebarProfileDiv"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <p>프로필</p>
        </div>
        <hr />

        <div
          className="sidebarCategoryDiv"
          onClick={() => {
            navigate("/category");
          }}
        >
          <p>카테고리</p>
          <div className="sidebarCategoryNameDiv">
            {todoCateList.map(
              ({ cate_id, cate_name }) => (
                <CateItem
                  key={cate_id}
                  cate_name={cate_name}
                />
              )
            )
            }
          </div>
        </div>
        <hr />

        <div
          className="sidebarPasswordDiv"
          onClick={() => {
            navigate("/passwordChange");
          }}
        >
          <p>비밀번호 재설정</p>
        </div>

        <div className="sidebarLogoutDiv" onClick={logoutForm}>
          <p>로그아웃</p>
        </div>

        <div className="sidebarDeleteDiv" onClick={openModal}>
          <p>계정 삭제하기</p>
        </div>
      </div>

      <Modal
        id="delUserModal"
        style={deleteUserStyles}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <form id="delUserModalContent" onSubmit={DeleteUserForm}>
          <input name="userId" value={userId} type="hidden" />
          <div id="delUserModalTitle">계정을 삭제하시겠습니까?</div>
          <button id="delUserCancelBtn" type="button" onClick={closeModal}>
            취소
          </button>
          <button id="delUserBtn" type="submit">
            확인
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Sidebar;
