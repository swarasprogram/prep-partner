from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import cast, String

from app.api import deps
from app.db.session import get_db
from app.db.models.questions import Question
from app.schemas import models as schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Question])
def read_questions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    questions = db.query(Question).offset(skip).limit(limit).all()
    return questions

@router.get("/company/{company_name}", response_model=List[schemas.Question])
def read_questions_by_company(
    company_name: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Fetch questions tagged for a specific company.
    Tags column is a JSON array, we search by casting to text and doing a case-insensitive LIKE match.
    """
    questions = (
        db.query(Question)
        .filter(cast(Question.tags, String).ilike(f"%{company_name}%"))
        .all()
    )
    return questions

@router.get("/seed", response_model=dict)
def seed_questions(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    """Seed the database with sample questions for major companies."""
    sample_questions = [
        # Google
        Question(title="Two Sum", content="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", question_type="DSA", difficulty="Easy", tags=["Google", "Amazon", "Array", "Hash Map"]),
        Question(title="Median of Two Sorted Arrays", content="Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.", question_type="DSA", difficulty="Hard", tags=["Google", "Apple", "Binary Search", "Array"]),
        Question(title="Regular Expression Matching", content="Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.", question_type="DSA", difficulty="Hard", tags=["Google", "Dynamic Programming", "String"]),
        Question(title="What is the time complexity of binary search?", content="What is the time complexity of binary search?", question_type="MCQ", options={"options": ["O(n)", "O(log n)", "O(n²)", "O(1)"]}, correct_answer="O(log n)", difficulty="Easy", tags=["Google", "Microsoft", "DSA"]),
        Question(title="Tell me about a time you resolved a conflict with a teammate.", content="Behavioral question about conflict resolution.", question_type="INTERVIEW", difficulty="Medium", tags=["Google", "Microsoft", "Amazon", "HR", "Behavioral"]),
        # Microsoft
        Question(title="LRU Cache", content="Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.", question_type="DSA", difficulty="Medium", tags=["Microsoft", "Facebook", "Hash Map", "Linked List"]),
        Question(title="Serialize and Deserialize Binary Tree", content="Design an algorithm to serialize and deserialize a binary tree.", question_type="DSA", difficulty="Hard", tags=["Microsoft", "Amazon", "Tree", "BFS"]),
        Question(title="What is polymorphism in OOP?", content="What is polymorphism in OOP?", question_type="MCQ", options={"options": ["Single inheritance", "Multiple forms", "Encapsulation", "Abstraction"]}, correct_answer="Multiple forms", difficulty="Easy", tags=["Microsoft", "Flipkart", "OOP"]),
        Question(title="Describe a project where you had to learn a new technology quickly.", content="Behavioral question about learning and adaptability.", question_type="INTERVIEW", difficulty="Medium", tags=["Microsoft", "Adobe", "HR", "Behavioral"]),
        # Amazon
        Question(title="Number of Islands", content="Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.", question_type="DSA", difficulty="Medium", tags=["Amazon", "Google", "BFS", "DFS", "Graph"]),
        Question(title="Word Ladder", content="A transformation sequence from word beginWord to word endWord using a dictionary wordList.", question_type="DSA", difficulty="Hard", tags=["Amazon", "BFS", "Graph", "String"]),
        Question(title="Which AWS service is used for serverless computing?", content="Which AWS service is used for serverless computing?", question_type="MCQ", options={"options": ["EC2", "S3", "Lambda", "RDS"]}, correct_answer="Lambda", difficulty="Easy", tags=["Amazon", "Cloud", "AWS"]),
        Question(title="Tell me about a time you delivered a project under tight deadline.", content="Behavioral question about delivery and ownership.", question_type="INTERVIEW", difficulty="Medium", tags=["Amazon", "Leadership Principles", "HR", "Behavioral"]),
        # Flipkart
        Question(title="Clone Graph", content="Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.", question_type="DSA", difficulty="Medium", tags=["Flipkart", "BFS", "DFS", "Graph"]),
        Question(title="Which data structure uses LIFO principle?", content="Which data structure uses LIFO principle?", question_type="MCQ", options={"options": ["Queue", "Stack", "Array", "LinkedList"]}, correct_answer="Stack", difficulty="Easy", tags=["Flipkart", "Adobe", "DSA"]),
        # Atlassian
        Question(title="Word Search II", content="Given an m x n board of characters and a list of strings words, return all words on the board.", question_type="DSA", difficulty="Hard", tags=["Atlassian", "Trie", "Backtracking"]),
        Question(title="What is the difference between REST and GraphQL?", content="Explain the key differences between REST APIs and GraphQL.", question_type="INTERVIEW", difficulty="Medium", tags=["Atlassian", "Adobe", "System Design", "API"]),
        # Adobe
        Question(title="Image Overlap", content="You are given two images represented by integer matrices (each of size n x n), A and B.", question_type="DSA", difficulty="Medium", tags=["Adobe", "Array", "Matrix"]),
        Question(title="What is the virtual DOM in React?", content="Explain the concept of virtual DOM in React and its advantages.", question_type="INTERVIEW", difficulty="Medium", tags=["Adobe", "Atlassian", "Frontend", "React"]),
    ]

    added = 0
    for q in sample_questions:
        existing = db.query(Question).filter(Question.title == q.title).first()
        if not existing:
            db.add(q)
            added += 1
    db.commit()
    return {"message": f"Seeded {added} new questions successfully."}
