import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";
import useToken from "@/hooks/useToken";
import DropDownCategory from "../Commons/DropDownCategory";

const S_write = () => {
  const { allToken } = useToken();

  const router = useRouter();

  const [title, setTitle] = useState<string>("");

  const [content, setContent] = useState<string>("");

  const [category, setCategory] = useState<string>("");

  const [imgFile, setImgFile] = useState<FileList | null>(null);

  const [video, setVideo] = useState("");

  // const [fileImage, setFileImage] = useState("");

  const errorAlert = () => {
    if (title.length == 0) {
      return alert("Please enter your title.");
    }
    if (category.length == 0) {
      return alert("Please enter your category.");
    }
    if (content.length == 0) {
      return alert("Please enter your content.");
    }
  };

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const onChangeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const onChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;
      setImgFile(file);
    }
  };

  // const onChangeVideo = (e: ChangeEvent<HTMLInputElement>) => {
  //   setVideo(e.target.value);
  // };

  const onChangeVideo = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setVideo(e.target.value);

    if (video === "") return;

    const videoIdFromURL =
      video.split("?v=").length > 1
        ? video.split("?v=")[1].split("&")[0]
        : false;
    if (videoIdFromURL) {
      setVideo(videoIdFromURL);
    }
  };

  // const onPlayerReady: YouTubeProps["onReady"] = (event) => {
  //   event.target.pauseVideo();
  // };

  // const opts: YouTubeProps["opts"] = {
  //   height: "390",
  //   width: "640",
  //   playerVars: {
  //     autoplay: 1,
  //   },
  // };

  // return <YouTube videoId={video} opts={opts} onReady={onPlayerReady} />;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const TOKEN = localStorage.getItem('accessToken');
    // console.log(TOKEN);

    console.log({
      title: title,
      category: category,
      context: content,
      images: imgFile,
      video: video,
    });

    let dataSet = {
      title: title,
      category: category,
      context: content,
      video: video,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dataSet));

    axios
      .post(
        "/api/main/new",
        {
          title: title,
          category: category,
          context: content,
          images: imgFile,
          video: video,
        },
        {
          headers: {
            // crossDomain: true,
            // credentials: 'include',
            "Content-Type": "multipart/form-data",
            withCredentials: true,
            Authorization: allToken,
          },
        }
      )
      // post를 보냈을 때 return 값(id)을 저장할 친구를 생성하는 코드 짜자
      .then((res) => {
        alert("Success write!");
        router.push({
          pathname: "/share",
          query: {
            id: res.data.id,
            page: res.data.page,
          },
        });
      })
      .catch((e) => {
        console.log(e);
        errorAlert();
      });
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <StyledDiv>
          <div>
            <StyledSpan>Category: </StyledSpan>
            <DropDownCategory onChange={onChangeCategory} />
          </div>
        </StyledDiv>
        <Container>
          <StyledInput
            type="text"
            placeholder="Please enter your title"
            value={title}
            onChange={onChangeTitle}
          />
          <StyledInput2
            type="text"
            placeholder="Write your tips contents"
            value={content}
            onChange={onChangeContent}
          />
          <StyledInput
            type="text"
            placeholder="Input youtube link here!"
            value={video}
            onChange={onChangeVideo}
          />
          {/* <div>
            <StyledInput
              type="text"
              placeholder="Input youtube link here!"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onChange={onChangeVideo}>Search</button>
            <ul>
              {video.map((video) => (
                <li key={video.id}>
                  <img src={video.thumbnail} alt="" />
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                  >
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
          <input
            id="input-file"
            accept="image/*"
            type="file"
            placeholder="Input file here!"
            onChange={onChangeImg}
            multiple
          />
          <BtnContainer>
            <Submit type="submit">registration</Submit>
          </BtnContainer>
        </Container>
      </form>
    </>
  );
};

export default S_write;

const StyledDiv = styled.div`
  width: 50vw;
`;

const StyledInput3 = styled.input`
  height: 5vh;
  margin-top: 3vh;
  padding: 0 6px;

  outline: none;
  border: 1px solid var(--color-main);
  border-radius: 5px;

  &:focus {
    border: 2px solid var(--color-main);
  }

  ::placeholder {
    color: #bebebe;
    font-weight: 600;
    font-size: large;
  }
`;

const StyledSpan = styled.span`
  margin-left: 3vw;

  color: var(--color-main);
  font-weight: 600;
  font-size: large;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* color: white; */
`;

const StyledInput = styled.input`
  width: 40vw;
  height: 6vh;
  margin-top: 2vh;
  padding: 0 6px;

  outline: none;
  border: 1px solid var(--color-main);
  border-radius: 5px;

  &:focus {
    border: 2px solid var(--color-main);
  }

  ::placeholder {
    color: #bebebe;
    font-weight: 600;
    font-size: large;
  }
`;

const StyledInput2 = styled.input`
  width: 40vw;
  height: 40vh;
  margin-top: 3vh;
  padding: 0 6px;

  outline: none;
  border: 1px solid var(--color-main);
  border-radius: 5px;

  &:focus {
    border: 2px solid var(--color-main);
  }

  ::placeholder {
    color: #bebebe;
    font-weight: 600;
    font-size: large;
  }
`;

const BtnContainer = styled.div`
  width: 40vw;
`;

const Submit = styled.button`
  float: right;
  margin-top: 3vh;
  margin-bottom: 1rem;
  padding: 3px 10px;

  background-color: var(--color-normal);
  color: white;
  border: 1px solid var(--color-normal);
  border-radius: 10px;
  font-weight: 600;
  font-size: large;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: var(--color-normal);
    border: 1px solid var(--color-normal);
  }
`;
