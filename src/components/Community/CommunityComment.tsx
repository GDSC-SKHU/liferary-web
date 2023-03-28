import React, { useEffect, useState } from "react";
import axios from "axios";
import useToken from "@/hooks/useToken";
import { Comment } from "@/types/comment";
import styled from "styled-components";
import { formatDate } from "@/types/date";
import { Btn, DateP, TimeContainer } from "../Share/ShareForm";

const CommunityComment = ({ boardPostId }: { boardPostId: number }) => {
  const { allToken } = useToken();

  const [newComment, setNewComment] = useState<string>("");

  const [list, setList] = useState<Comment[]>();

  useEffect(() => {
    axios.get(`/api/comment/${boardPostId}/page/1`).then((res) => {
      setList(res.data);
      // console.log(list);
    });
  }, []);

  const handleSubmitComment = () => {
    if (newComment.length === 0) {
      alert("Please share your think!");

      return;
    }

    axios.post(
      `/api/comment/new`,
      {
        boardPostId,
        context: newComment,
      },
      {
        headers: {
          withCredentials: true,
          Authorization: allToken,
        },
      }
    );
  };

  return (
    <>
      {list?.length ? (
        <>
          {list.map((el) => (
            <Container
              style={{ marginBottom: "1rem" }}
              key={(el.id, el.writer, el.context)}
            >
              <CommentItem key={el.id}>
                <Writer>{el.writer}</Writer>
                <Content>{el.context} </Content>
              </CommentItem>
              <TimeContainer style={{ paddingLeft: "0" }}>
                <DateP style={{ color: "#8e8e8e", marginBottom: "5px" }}>
                  {formatDate(el.modifiedDate)}
                </DateP>
              </TimeContainer>{" "}
            </Container>
          ))}
        </>
      ) : (
        <Notion>No comments</Notion>
      )}
      <CommentForm onSubmit={handleSubmitComment}>
        <CommentInput
          placeholder="Write comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Btn type="submit" style={{ margin: "0", marginTop: "10px" }}>
          Registration
        </Btn>
      </CommentForm>
    </>
  );
};

export default CommunityComment;

const Container = styled.div`
  border-bottom: 1px solid #d3d3d3;
`;

const CommentItem = styled.div`
  width: 55vw;

  color: black;
`;

const Writer = styled.span`
  margin-right: 1rem;

  font-weight: 600;
`;

const Content = styled.span``;

const CommentForm = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 55vw;
  margin-bottom: 2rem;
`;

const CommentInput = styled.textarea`
  width: 50vw;
  height: 5vh;

  border: none;
  border-bottom: 1px solid black;

  outline: none;
`;

const Notion = styled.p`
  color: black;
`;
